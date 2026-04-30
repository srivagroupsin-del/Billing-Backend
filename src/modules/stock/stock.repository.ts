import pool from "../../config/db";

export class StockRepository {
  async createOrUpdateStock(conn: any, businessId: number, data: any) {
    const { product_id, supplier_id, is_self_produced } = data;

    const [rows]: any = await conn.execute(
      `SELECT id FROM product_stock
   WHERE business_id=? 
   AND product_id=? 
   AND (supplier_id <=> ?)
   AND is_self_produced = ?
   AND is_deleted = 0`,
      [businessId, product_id, supplier_id ?? null, is_self_produced ? 1 : 0],
    );

    let stockId;

    if (rows.length > 0) {
      stockId = rows[0].id;

      await conn.execute(
        `UPDATE product_stock
       SET supplier_id=?, is_self_produced=?
       WHERE id=?`,
        [supplier_id ?? null, is_self_produced ? 1 : 0, stockId],
      );
    } else {
      const [result]: any = await conn.execute(
        `INSERT INTO product_stock
       (business_id, product_id, supplier_id, is_self_produced)
       VALUES (?,?,?,?)`,
        [businessId, product_id, supplier_id ?? null, is_self_produced ? 1 : 0],
      );

      stockId = result.insertId;
    }

    return stockId;
  }

  async saveVariants(conn: any, stockId: number, variants: any[]) {
    const variantMap: any = {};

    for (const v of variants) {
      await conn.execute(
        `
      INSERT INTO product_stock_variants
      (stock_id, variant_id, buying_price, profit_margin, selling_price, qty)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        buying_price = VALUES(buying_price),
        profit_margin = VALUES(profit_margin),
        selling_price = VALUES(selling_price),
        qty = VALUES(qty),
        is_deleted = 0
    `,
        [
          stockId,
          v.variant_id,
          v.buying_price || 0,
          v.profit_margin || 0,
          v.selling_price || 0,
          v.qty || 0,
        ],
      );

      // 🔥 GET ID
      const [row]: any = await conn.execute(
        `SELECT id FROM product_stock_variants 
       WHERE stock_id=? AND variant_id=?`,
        [stockId, v.variant_id],
      );

      const variantRowId = row[0].id;
      variantMap[v.variant_id] = variantRowId;

      // 🔥 UPSERT STOCK TYPES ALSO
      if (v.stock_types?.length) {
        for (const t of v.stock_types) {
          await conn.execute(
            `
          INSERT INTO product_stock_types
          (stock_id, variant_id, stock_type_id, qty)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            qty = VALUES(qty),
            is_deleted = 0
        `,
            [stockId, v.variant_id, t.stock_type_id, t.qty || 0],
          );
        }
      }
    }

    return variantMap;
  }

  async saveStockLocations(data: any[], conn?: any) {
    if (!data.length) return;

    const executor = conn || pool;

    const values = data.map((d) => [
      d.stock_variant_id,
      d.stock_type_id,
      d.location_id,
      d.qty || 0,
      d.business_id,
    ]);

    await executor.query(
      `INSERT INTO product_stock_locations
     (stock_variant_id, stock_type_id, location_id, qty, business_id)
     VALUES ?
     ON DUPLICATE KEY UPDATE qty = VALUES(qty)`,
      [values],
    );
  }

  async deleteStockLocations(conn: any, stockId: number) {
    // Requirements say: must delete using JOIN on stock_variants
    await conn.execute(
      `DELETE psl FROM product_stock_locations psl
     JOIN product_stock_variants psv 
       ON psv.id = psl.stock_variant_id
     WHERE psv.stock_id = ?`,
      [stockId],
    );
  }

  async getStocks(businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT 
      ps.id AS stock_id,
      ps.product_id,
      p.product_name,
      ps.supplier_id,
      ps.created_at
    FROM product_stock ps
    LEFT JOIN srivagroupsin_product_db_2.product p 
      ON p.id = ps.product_id
    WHERE ps.business_id = ? 
    AND ps.is_deleted = 0
    ORDER BY ps.id DESC`,
      [businessId],
    );
    return rows;
  }

  async getStock(stockId: number, businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM product_stock
       WHERE id = ? AND business_id = ? AND is_deleted = 0`,
      [stockId, businessId],
    );

    return rows[0];
  }

  async getVariants(stockId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM product_stock_variants
       WHERE stock_id = ? AND is_deleted = 0`,
      [stockId],
    );

    return rows;
  }

  async getStockTypeMaster() {
    const [rows]: any = await pool.execute(
      `SELECT id, name FROM stock_type_master WHERE is_deleted = 0`,
    );

    return rows;
  }

  async getStockTypes(stockId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM product_stock_types
       WHERE stock_id = ? AND is_deleted = 0`,
      [stockId],
    );
    return rows;
  }

  async getStockLocations(stockId: number, businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT 
      psl.*,
      sl.name as location_name
     FROM product_stock_locations psl
     JOIN product_stock_variants psv 
       ON psv.id = psl.stock_variant_id
     LEFT JOIN storage_locations sl 
       ON sl.id = psl.location_id
     WHERE psv.stock_id = ?
     AND psl.business_id = ?
     AND sl.is_deleted = 0`,
      [stockId, businessId],
    );

    return rows;
  }

  async deleteStock(stockId: number, businessId: number) {
    await pool.execute(
      `UPDATE product_stock SET is_deleted = 1
       WHERE id = ? AND business_id = ?`,
      [stockId, businessId],
    );
  }

  async updateStock(conn: any, stockId: number, businessId: number, data: any) {
    const { product_id, supplier_id, is_self_produced } = data;

    await conn.execute(
      `UPDATE product_stock
     SET product_id = ?, 
         supplier_id = ?, 
         is_self_produced = ?
     WHERE id = ? AND business_id = ?`,
      [
        product_id,
        supplier_id ?? null,
        is_self_produced ? 1 : 0,
        stockId,
        businessId,
      ],
    );
  }

  async deleteVariants(conn: any, stockId: number) {
    await conn.execute(
      `UPDATE product_stock_variants SET is_deleted = 1 WHERE stock_id = ?`,
      [stockId],
    );
  }

  async deleteStockTypes(conn: any, stockId: number) {
    await conn.execute(
      `UPDATE product_stock_types SET is_deleted = 1 WHERE stock_id = ?`,
      [stockId],
    );
  }

  async updateSingleLocation(data: any) {
    await pool.execute(
      `INSERT INTO product_stock_locations
     (stock_variant_id, stock_type_id, location_id, qty, business_id)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE qty = VALUES(qty)`,
      [
        data.stock_variant_id,
        data.stock_type_id,
        data.location_id,
        data.qty,
        data.business_id,
      ],
    );
  }

  async deleteSingleLocation(data: any, businessId: number) {
    await pool.execute(
      `DELETE FROM product_stock_locations
     WHERE stock_variant_id = ?
     AND stock_type_id = ?
     AND location_id = ?
     AND business_id = ?`,
      [data.stock_variant_id, data.stock_type_id, data.location_id, businessId],
    );
  }

  async validateLocationOwner(locationId: number, businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT id FROM storage_locations 
       WHERE id = ? AND business_id = ? AND is_deleted = 0`,
      [locationId, businessId],
    );
    return rows.length > 0;
  }

  async getVariantsByStockIds(stockIds: number[]) {
    if (!stockIds.length) return [];

    const [rows]: any = await pool.query(
      `SELECT 
      id,
      stock_id,
      variant_id,
      buying_price,
      profit_margin,
      selling_price,
      qty
     FROM product_stock_variants
     WHERE stock_id IN (?) 
     AND is_deleted = 0`,
      [stockIds],
    );

    return rows;
  }

  async getStockTypesByStockIds(stockIds: number[]) {
    if (!stockIds.length) return [];

    const [rows]: any = await pool.query(
      `SELECT 
      pst.stock_id,
      pst.variant_id,
      pst.stock_type_id,
      pst.qty,
      stm.name
     FROM product_stock_types pst
     LEFT JOIN stock_type_master stm 
       ON stm.id = pst.stock_type_id
     WHERE pst.stock_id IN (?) 
     AND pst.is_deleted = 0`,
      [stockIds],
    );

    return rows;
  }

  async increaseStock(conn: any, data: any) {
    // 🔥 update variant stock
    await conn.execute(
      `
    UPDATE product_stock_variants
    SET qty = qty + ?
    WHERE stock_id = ? AND variant_id = ?
  `,
      [data.qty, data.stock_id, data.variant_id],
    );

    // 🔥 update total stock
    await conn.execute(
      `
    UPDATE product_stock
    SET total_qty = total_qty + ?
    WHERE id = ?
  `,
      [data.qty, data.stock_id],
    );
  }
}
