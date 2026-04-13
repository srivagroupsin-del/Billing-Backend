import axios from "axios";
import pool from "../../config/db";
import { StockRepository } from "./stock.repository";
import * as authRepo from "../../modules/auth/auth.repository";

export class StockService {
  private repo = new StockRepository();

  // =========================
  // ✅ STEP 1: SAVE STOCK ONLY
  // =========================
  async saveStock(businessId: number, data: any) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const stockId = await this.repo.createOrUpdateStock(
        conn,
        businessId,
        data,
      );

      for (const v of data.variants || []) {
        const totalStockTypeQty = (v.stock_types || []).reduce(
          (sum: number, t: any) => sum + (t.qty || 0),
          0,
        );

        if (totalStockTypeQty !== v.qty) {
          throw new Error(`Stock mismatch for variant ${v.variant_id}`);
        }
      }

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

  // =========================
  // ✅ STEP 2: ASSIGN STORAGE
  // =========================
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
            if (seen.has(key)) throw new Error("Duplicate location entry");
            seen.add(key);

            // 2. Validate location ownership
            const isOwner = await this.repo.validateLocationOwner(
              loc.location_id,
              businessId,
            );
            if (!isOwner) {
              throw new Error(
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
            throw new Error(
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

  // =========================
  // GET STOCK LIST
  // =========================
  async getStocks(userId: number, businessId: number) {
    const user = await authRepo.getUserById(userId);

    if (!user?.central_token) {
      throw new Error("Central token missing");
    }

    const supplierRes = await axios.get(
      "https://user.jobes24x7.com/api/suppliers",
      {
        headers: {
          Authorization: `Bearer ${user.central_token}`,
        },
      },
    );

    const supplierList = supplierRes.data?.data?.data || [];
    const supplierMap = new Map(
      supplierList.map((s: any) => [s.id, s.business_name]),
    );

    const stocks = await this.repo.getStocks(businessId);

    const stockIds = stocks.map((s: any) => s.stock_id);

    const variants = await this.repo.getVariantsByStockIds(stockIds);
    const types = await this.repo.getStockTypesByStockIds(stockIds);
    const stockTypeMaster = await this.repo.getStockTypeMaster();

    const variantMap: any = {};
    const typeMap: any = {};

    // group variants
    variants.forEach((v: any) => {
      if (!variantMap[v.stock_id]) variantMap[v.stock_id] = [];
      variantMap[v.stock_id].push(v);
    });

    // group stock types
    types.forEach((t: any) => {
      if (!typeMap[t.variant_id]) typeMap[t.variant_id] = [];
      typeMap[t.variant_id].push(t);
    });

    // attach stock types to variants
    Object.values(variantMap).forEach((variantList: any) => {
      variantList.forEach((v: any) => {
        const existing = typeMap[v.id] || [];

        v.stock_types = stockTypeMaster.map((type: any) => {
          const found = existing.find((t: any) => t.stock_type_id === type.id);

          return {
            stock_type_id: type.id,
            name: type.name,
            qty: found?.qty || 0,
          };
        });
      });
    });

    return stocks.map((row: any) => ({
      id: row.stock_id,
      product_id: row.product_id,
      product_name: row.product_name,
      created_at: row.created_at,

      supplier: row.supplier_id
        ? {
            id: row.supplier_id,
            name: supplierMap.get(row.supplier_id) || null,
          }
        : null,

      variants: variantMap[row.stock_id] || [],
    }));
  }

  // =========================
  // GET SINGLE STOCK
  // =========================
  async getStockById(stockId: number, userId: number, businessId: number) {
    const stock = await this.repo.getStock(stockId, businessId);

    const variants = await this.repo.getVariants(stockId);
    const types = await this.repo.getStockTypes(stockId);
    const stockTypeMaster = await this.repo.getStockTypeMaster();

    const typeMap: any = {};

    types.forEach((t: any) => {
      if (!typeMap[t.variant_id]) typeMap[t.variant_id] = [];
      typeMap[t.variant_id].push(t);
    });

    variants.forEach((v: any) => {
      const existing = typeMap[v.id] || [];

      v.stock_types = stockTypeMaster.map((type: any) => {
        const found = existing.find((t: any) => t.stock_type_id === type.id);

        return {
          stock_type_id: type.id,
          name: type.name,
          qty: found?.qty || 0,
        };
      });
    });

    return {
      ...stock,
      variants,
    };
  }

  // =========================
  // DELETE
  // =========================
  async deleteStock(stockId: number, businessId: number) {
    await this.repo.deleteStock(stockId, businessId);
  }

  // =========================
  // UPDATE STOCK (STEP 1)
  // =========================
  async updateStock(stockId: number, businessId: number, data: any) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      await this.repo.updateStock(conn, stockId, businessId, data);

      await this.repo.deleteStockTypes(conn, stockId);
      await this.repo.deleteVariants(conn, stockId);

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

  async getAssignedLocations(stockId: number, businessId: number) {
    return await this.repo.getStockLocations(stockId, businessId);
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
    if (!isOwner) throw new Error("Location does not belong to business");

    return await this.repo.updateSingleLocation({
      ...data,
      business_id: businessId,
    });
  }

  async deleteSingleLocation(data: any, businessId: number) {
    return await this.repo.deleteSingleLocation(data, businessId);
  }
}
