import { BusinessError } from "../../utils/appError";
import axios from "axios";
import pool from "../../config/db";
import { StockRepository } from "./stock.repository";
import * as authRepo from "../../modules/auth/auth.repository";
import { getAuthHeaders } from "../../utils/getAuthHeaders";
import { fetchBulkProductDetails } from "../products/product.service";
import { SupplierService } from "../suppliers/supplier.service";

export class StockService {
  private repo = new StockRepository();

  async buildLocationPath(locationId: number): Promise<string> {
    const names: string[] = [];

    let currentId = locationId;

    while (currentId) {
      const [rows]: any = await pool.execute(
        `SELECT id, name, parent_id
       FROM storage_locations
       WHERE id = ?`,
        [currentId],
      );

      if (!rows.length) break;

      names.unshift(rows[0].name);

      currentId = rows[0].parent_id;
    }

    return names.join(" > ");
  }

  async saveStock(businessId: number, data: any) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // 🔥 REMOVE EMPTY VARIANTS
      data.variants = (data.variants || []).filter((v: any) => {
        const totalQty = Number(v.qty || 0);
        const buyingPrice = Number(v.buying_price || 0);
        const sellingPrice = Number(v.selling_price || 0);

        return totalQty > 0 || buyingPrice > 0 || sellingPrice > 0;
      });

      // 🔥 VALIDATE AT LEAST ONE VARIANT
      if (!data.variants.length) {
        throw new BusinessError("At least one variant required");
      }

      // 🔥 VALIDATE STOCK TYPE TOTAL
      for (const v of data.variants || []) {
        const totalStockTypeQty = (v.stock_types || []).reduce(
          (sum: number, t: any) => sum + Number(t.qty || 0),
          0,
        );

        if (totalStockTypeQty !== Number(v.qty || 0)) {
          throw new BusinessError(`Stock mismatch for variant ${v.variant_id}`);
        }
      }

      // 🔥 VALIDATE VARIANT OWNERSHIP
      for (const v of data.variants || []) {
        const validVariant = await this.repo.checkVariantBelongsToBusiness(
          v.variant_id,
          businessId,
        );

        if (!validVariant) {
          throw new BusinessError(
            `Variant ${v.variant_id} does not belong to this business`,
          );
        }
      }

      // 🔥 CREATE STOCK
      const stockId = await this.repo.createOrUpdateStock(
        conn,
        businessId,
        data,
      );

      // 🔥 INSERT VARIANTS
      if (data.variants?.length) {
        await this.repo.saveVariants(conn, stockId, data.variants);
      }

      await conn.commit();

      return { stock_id: stockId };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async updateStock(stockId: number, businessId: number, data: any) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // 🔥 REMOVE EMPTY VARIANTS
      data.variants = (data.variants || []).filter((v: any) => {
        const totalQty = Number(v.qty || 0);
        const buyingPrice = Number(v.buying_price || 0);
        const sellingPrice = Number(v.selling_price || 0);

        return totalQty > 0 || buyingPrice > 0 || sellingPrice > 0;
      });

      // 🔥 VALIDATE AT LEAST ONE VARIANT
      if (!data.variants.length) {
        throw new BusinessError("At least one variant required");
      }

      // 🔥 VALIDATE STOCK TYPE TOTAL
      for (const v of data.variants || []) {
        const totalStockTypeQty = (v.stock_types || []).reduce(
          (sum: number, t: any) => sum + Number(t.qty || 0),
          0,
        );

        if (totalStockTypeQty !== Number(v.qty || 0)) {
          throw new BusinessError(`Stock mismatch for variant ${v.variant_id}`);
        }
      }

      // 🔥 VALIDATE VARIANT OWNERSHIP
      for (const v of data.variants || []) {
        const validVariant = await this.repo.checkVariantBelongsToBusiness(
          v.variant_id,
          businessId,
        );

        if (!validVariant) {
          throw new BusinessError(
            `Variant ${v.variant_id} does not belong to this business`,
          );
        }
      }

      // 🔥 UPDATE STOCK MASTER
      await this.repo.updateStock(conn, stockId, businessId, data);

      // 🔥 DELETE OLD DATA
      await this.repo.deleteVariants(conn, stockId);
      await this.repo.deleteStockTypes(conn, stockId);

      // 🔥 INSERT NEW DATA
      if (data.variants?.length) {
        await this.repo.saveVariants(conn, stockId, data.variants);
      }

      await conn.commit();

      return { stock_id: stockId };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async assignStockLocations(stockId: number, businessId: number, data: any) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const locationPayload: any[] = [];
      const seen = new Set();

      for (const v of data.variants || []) {
        for (const t of v.stock_types || []) {
          let locationQtySum = 0;

          for (const loc of t.locations || []) {
            // 1. Prevent duplicate locations
            const key = `${v.stock_variant_id}-${t.stock_type_id}-${loc.location_id}`;
            if (seen.has(key))
              throw new BusinessError("Duplicate location entry");
            seen.add(key);

            // 2. Validate location ownership
            const isOwner = await this.repo.validateLocationOwner(
              loc.location_id,
              businessId,
            );
            if (!isOwner) {
              throw new BusinessError(
                `Location ${loc.location_id} does not belong to business`,
              );
            }

            locationQtySum += loc.qty || 0;

            locationPayload.push({
              stock_variant_id: v.stock_variant_id,
              stock_type_id: t.stock_type_id,
              location_id: loc.location_id,
              qty: loc.qty || 0,
              business_id: businessId,
            });
          }

          // 3. Validate qty: location qty sum <= stock_type qty
          if (locationQtySum > t.qty) {
            throw new BusinessError(
              `Location qty sum (${locationQtySum}) exceeds stock type qty (${t.qty}) for variant ${v.stock_variant_id}`,
            );
          }
        }
      }

      // 🔥 DELETE OLD
      await this.repo.deleteStockLocations(conn, stockId);

      // 🔥 INSERT NEW
      if (locationPayload.length) {
        await this.repo.saveStockLocations(locationPayload, conn);
      }

      await conn.commit();

      return { success: true };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async getStocks(userId: number, businessId: number) {
    const user = await authRepo.getUserById(userId);

    if (!user?.central_token) {
      throw new BusinessError("Central token missing");
    }

    const supplierService = new SupplierService();

    const supplierRes = await supplierService.getAllSuppliers(userId);

    const supplierList = supplierRes?.data?.data || [];

    const supplierMap = new Map(
      supplierList.map((s: any) => {
        const key = Number(s.id);

        const name =
          s.supplier_name || s.company_name || s.business_name || "Unknown";

        return [key, name];
      }),
    );

    const stocks = await this.repo.getStocks(businessId);

    const productIds: number[] = [
      ...new Set<number>(
        stocks
          .map((s: any) => Number(s.product_id))
          .filter((id: number) => !isNaN(id)),
      ),
    ];

    const products = await fetchBulkProductDetails(productIds);

    const productMap = new Map<number, any>(
      products.map((p: any) => [p.id, p]),
    );

    const stockIds = stocks.map((s: any) => s.stock_id);

    const variants = await this.repo.getVariantsByStockIds(stockIds);
    const types = await this.repo.getStockTypesByStockIds(stockIds);

    const variantMap: any = {};
    const typeMap: any = {};

    // 🔥 GROUP VARIANTS
    variants.forEach((v: any) => {
      if (!variantMap[v.stock_id]) {
        variantMap[v.stock_id] = [];
      }

      variantMap[v.stock_id].push(v);
    });

    // 🔥 GROUP STOCK TYPES
    types.forEach((t: any) => {
      if (!typeMap[t.variant_id]) {
        typeMap[t.variant_id] = [];
      }

      typeMap[t.variant_id].push(t);
    });

    // 🔥 ATTACH STOCK TYPES
    Object.values(variantMap).forEach((variantList: any) => {
      variantList.forEach((v: any) => {
        const existing = typeMap[v.id] || [];

        v.stock_types = existing.map((t: any) => ({
          stock_type_id: t.stock_type_id,
          name: t.name,
          qty: Number(t.qty),
        }));

        // 🔥 VARIANT TOTAL
        v.total_qty = v.stock_types.reduce(
          (sum: number, t: any) => sum + Number(t.qty || 0),
          0,
        );
      });
    });

    return stocks.map((row: any) => {
      // 🔥 REMOVE EMPTY VARIANTS
      const variants = variantMap[row.stock_id] || [];

      // 🔥 STOCK TOTAL
      const total_qty = variants.reduce(
        (sum: number, v: any) => sum + Number(v.total_qty || 0),
        0,
      );

      return {
        id: row.stock_id,

        product_id: row.product_id,

        product_name:
          productMap.get(Number(row.product_id))?.name || row.product_name,

        base_image: productMap.get(Number(row.product_id))?.base_image || null,

        dynamic_fields:
          productMap.get(Number(row.product_id))?.dynamic_fields || [],

        created_at: row.created_at,

        supplier: row.supplier_id
          ? {
              id: row.supplier_id,
              name: supplierMap.get(Number(row.supplier_id)) || "Unknown",
            }
          : null,

        total_qty,

        variants,
      };
    });
  }

  async getStockById(stockId: number, businessId: number) {
    const stock = await this.repo.getStock(stockId, businessId);

    const variants = await this.repo.getVariants(stockId);

    const types = await this.repo.getStockTypes(stockId);

    const typeMap: any = {};

    // 🔥 GROUP STOCK TYPES
    types.forEach((t: any) => {
      if (!typeMap[t.variant_id]) {
        typeMap[t.variant_id] = [];
      }

      typeMap[t.variant_id].push(t);
    });

    // 🔥 ATTACH STOCK TYPES
    variants.forEach((v: any) => {
      const existing = typeMap[v.id] || [];

      v.stock_types = existing
        .filter((t: any) => Number(t.qty) > 0)
        .map((t: any) => ({
          stock_type_id: t.stock_type_id,
          name: t.name,
          qty: Number(t.qty),
        }));

      // 🔥 VARIANT TOTAL
      v.total_qty = v.stock_types.reduce(
        (sum: number, t: any) => sum + Number(t.qty || 0),
        0,
      );
    });

    // 🔥 REMOVE EMPTY VARIANTS
    const filteredVariants = variants.filter((v: any) => v.total_qty > 0);

    // 🔥 OVERALL TOTAL
    const total_qty = filteredVariants.reduce(
      (sum: number, v: any) => sum + Number(v.total_qty || 0),
      0,
    );

    return {
      ...stock,

      total_qty,

      variants: filteredVariants,
    };
  }

  async deleteStock(stockId: number, businessId: number) {
    await this.repo.deleteStock(stockId, businessId);
  }

  async getAssignedLocations(stockId: number, businessId: number) {
    const rows = await this.repo.getStockLocations(stockId, businessId);
    // 🔥 ADD HERE
    for (const row of rows) {
      row.full_location = await this.buildLocationPath(row.location_id);
    }
    return rows;
  }

  async deleteAssignedLocations(stockId: number, businessId: number) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      await this.repo.deleteStockLocations(conn, stockId);

      await conn.commit();

      return { success: true };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async updateSingleLocation(data: any, businessId: number) {
    // Validate ownership before single update
    const isOwner = await this.repo.validateLocationOwner(
      data.location_id,
      businessId,
    );
    if (!isOwner)
      throw new BusinessError("Location does not belong to business");

    return await this.repo.updateSingleLocation({
      ...data,
      business_id: businessId,
    });
  }

  async deleteSingleLocation(data: any, businessId: number) {
    return await this.repo.deleteSingleLocation(data, businessId);
  }
}
