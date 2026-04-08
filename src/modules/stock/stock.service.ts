import pool from "../../config/db";
import { StockRepository } from "./stock.repository";

export class StockService {
  private repo = new StockRepository();

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
          throw new Error(
            `Stock mismatch for variant ${v.variant_id}. Total ${v.qty}, but split ${totalStockTypeQty}`,
          );
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

  async getStocks(businessId: number) {
    const stocks = await this.repo.getStocks(businessId);
    const locations = await this.repo.getAllLocations(businessId);

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

    // group stock types by variant_id
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
            name: row.supplier_name,
          }
        : null,

      location: row.location_id
        ? {
            id: row.location_id,
            name: row.location_name,
            full_path: buildLocationPath(locations, row.location_id),
          }
        : null,

      variants: variantMap[row.stock_id] || [],
    }));
  }

  async getStockById(stockId: number, businessId: number) {
    const stock = await this.repo.getStock(stockId, businessId);

    const variants = await this.repo.getVariants(stockId);
    const types = await this.repo.getStockTypes(stockId);
    const stockTypeMaster = await this.repo.getStockTypeMaster();

    const typeMap: any = {};

    types.forEach((t: any) => {
      if (!typeMap[t.variant_id]) typeMap[t.variant_id] = [];
      typeMap[t.variant_id].push(t);
    });

    // attach stock types
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

    // ✅ ADD THIS PART (IMPORTANT)
    let location_path: any[] = [];

    if (stock?.storage_location_id) {
      location_path = await this.repo.getLocationPath(
        stock.storage_location_id,
        businessId,
      );
    }

    return {
      ...stock,
      variants,
      location_path,
    };
  }

  async deleteStock(stockId: number, businessId: number) {
    await this.repo.deleteStock(stockId, businessId);
  }

  async updateStock(stockId: number, businessId: number, data: any) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      await this.repo.updateStock(conn, stockId, businessId, data);

      // ✅ FIRST delete child
      await this.repo.deleteStockTypes(conn, stockId);

      // ✅ THEN delete parent
      await this.repo.deleteVariants(conn, stockId);

      for (const v of data.variants || []) {
        const totalStockTypeQty = (v.stock_types || []).reduce(
          (sum: number, t: any) => sum + (t.qty || 0),
          0,
        );

        if (totalStockTypeQty !== v.qty) {
          throw new Error(
            `Stock mismatch for variant ${v.variant_id}. Total ${v.qty}, but split ${totalStockTypeQty}`,
          );
        }
      }

      // ✅ THEN insert again
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
}

function buildLocationPath(locations: any[], locationId: number) {
  let path: string[] = [];

  let current = locations.find((l) => l.id === locationId);

  while (current) {
    path.unshift(current.name);
    current = locations.find((l) => l.id === current.parent_id);
  }

  return path.join(" → ");
}
