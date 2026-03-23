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

      if (data.variants?.length) {
        await this.repo.saveVariants(conn, stockId, data.variants);
      }

      if (data.stock_types?.length) {
        await this.repo.saveStockTypes(conn, stockId, data.stock_types);
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

    const variantMap: any = {};
    const typeMap: any = {};

    variants.forEach((v: any) => {
      if (!variantMap[v.stock_id]) variantMap[v.stock_id] = [];
      variantMap[v.stock_id].push(v);
    });

    types.forEach((t: any) => {
      if (!typeMap[t.stock_id]) typeMap[t.stock_id] = [];
      typeMap[t.stock_id].push(t);
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
      stock_types: typeMap[row.stock_id] || [],
    }));
  }
  async getStockById(stockId: number, businessId: number) {
    const stock = await this.repo.getStock(stockId, businessId);

    const variants = await this.repo.getVariants(stockId);
    const types = await this.repo.getStockTypes(stockId);

    return {
      ...stock,
      variants,
      stock_types: types,
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

      await this.repo.deleteVariants(conn, stockId);
      if (data.variants?.length) {
        await this.repo.saveVariants(conn, stockId, data.variants);
      }

      await this.repo.deleteStockTypes(conn, stockId);
      if (data.stock_types?.length) {
        await this.repo.saveStockTypes(conn, stockId, data.stock_types);
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
