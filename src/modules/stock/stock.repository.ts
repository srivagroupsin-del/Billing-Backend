import pool from "../../config/db";

export class StockRepository {
  async createOrUpdateStock(conn: any, businessId: number, data: any) {
    const { product_id, supplier_id, is_self_produced, storage_location_id } =
      data;

    const [rows]: any = await conn.execute(
      `SELECT id FROM product_stock
     WHERE business_id=? AND product_id=? AND storage_location_id=?`,
      [businessId, product_id, storage_location_id],
    );

    let stockId;

    if (rows.length > 0) {
      stockId = rows[0].id;

      await conn.execute(
        `UPDATE product_stock
       SET supplier_id=?, is_self_produced=?
       WHERE id=?`,
        [supplier_id || null, is_self_produced ? 1 : 0, stockId],
      );
    } else {
      const [result]: any = await conn.execute(
        `INSERT INTO product_stock
       (business_id, product_id, supplier_id, is_self_produced, storage_location_id)
       VALUES (?,?,?,?,?)`,
        [
          businessId,
          product_id,
          supplier_id || null,
          is_self_produced ? 1 : 0,
          storage_location_id,
        ],
      );

      stockId = result.insertId;
    }

    return stockId;
  }

  async saveVariants(conn: any, stockId: number, variants: any[]) {
    for (const v of variants) {
      const [result]: any = await conn.execute(
        `INSERT INTO product_stock_variants
       (stock_id, variant_id, buying_price, profit_margin, selling_price, qty)
       VALUES (?,?,?,?,?,?)`,
        [
          stockId,
          v.variant_id,
          v.buying_price || 0,
          v.profit_margin || 0,
          v.selling_price || 0,
          v.qty || 0,
        ],
      );

      const variantRowId = result.insertId;

      // ✅ SAVE STOCK TYPES UNDER THIS VARIANT
      if (v.stock_types?.length) {
        const values = v.stock_types.map((t: any) => [
          stockId,
          variantRowId, // 🔥 important
          t.stock_type_id,
          t.qty,
        ]);

        await conn.query(
          `INSERT INTO product_stock_types
        (stock_id, variant_id, stock_type_id, qty)
        VALUES ?`,
          [values],
        );
      }
    }
  }

  async getAllLocations(businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT id, name, parent_id
     FROM storage_locations
     WHERE business_id = ?`,
      [businessId],
    );

    return rows;
  }

  async getStocks(businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT 
      ps.id AS stock_id,
      ps.product_id,
      p.product_name,
      ps.created_at,

      s.id AS supplier_id,
      s.name AS supplier_name,

      sl.id AS location_id,
      sl.name AS location_name,
      sl.parent_id

    FROM product_stock ps

    LEFT JOIN srivagroupsin_product_db_2.product p 
      ON p.id = ps.product_id

    LEFT JOIN suppliers s 
      ON s.id = ps.supplier_id

    LEFT JOIN storage_locations sl 
      ON sl.id = ps.storage_location_id

    WHERE ps.business_id = ?
    ORDER BY ps.id DESC`,
      [businessId],
    );

    return rows;
  }
  async getStock(stockId: number, businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM product_stock
       WHERE id = ? AND business_id = ?`,
      [stockId, businessId],
    );

    return rows[0];
  }

  async getVariants(stockId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM product_stock_variants
       WHERE stock_id = ?`,
      [stockId],
    );

    return rows;
  }

  async getVariantsByStockIds(stockIds: number[]) {
    if (!stockIds.length) return []; // 🔥 safety

    const [rows]: any = await pool.query(
      `SELECT 
      psv.id,                -- ✅ ADD THIS
      psv.stock_id,
      psv.variant_id,
      vm.name AS variant_name,
      psv.buying_price,
      psv.profit_margin,
      psv.selling_price,
      psv.qty
    FROM product_stock_variants psv
    LEFT JOIN product_variant_master vm 
      ON vm.id = psv.variant_id
    WHERE psv.stock_id IN (?)`,
      [stockIds],
    );

    return rows;
  }

  async getStockTypesByStockIds(stockIds: number[]) {
    if (!stockIds.length) return []; // ✅ add this

    const [rows]: any = await pool.query(
      `SELECT 
      pst.stock_id,
      pst.variant_id,
      pst.stock_type_id,
      stm.name,
      pst.qty
    FROM product_stock_types pst
    LEFT JOIN stock_type_master stm 
      ON stm.id = pst.stock_type_id
    WHERE pst.stock_id IN (?)`,
      [stockIds],
    );

    return rows;
  }

  async getStockTypeMaster() {
    const [rows]: any = await pool.execute(
      `SELECT id, name FROM stock_type_master`,
    );

    return rows;
  }

  async getStockTypes(stockId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM product_stock_types
       WHERE stock_id = ?`,
      [stockId],
    );
    return rows;
  }

  async deleteStock(stockId: number, businessId: number) {
    await pool.execute(
      `DELETE FROM product_stock
       WHERE id = ? AND business_id = ?`,
      [stockId, businessId],
    );
  }

  async updateStock(conn: any, stockId: number, businessId: number, data: any) {
    const { product_id, supplier_id, is_self_produced, storage_location_id } =
      data;

    await conn.execute(
      `UPDATE product_stock
     SET product_id = ?, 
         supplier_id = ?, 
         is_self_produced = ?, 
         storage_location_id = ?
     WHERE id = ? AND business_id = ?`,
      [
        product_id,
        supplier_id || null,
        is_self_produced ? 1 : 0,
        storage_location_id || null,
        stockId,
        businessId,
      ],
    );
  }

  async deleteVariants(conn: any, stockId: number) {
    await conn.execute(
      `DELETE FROM product_stock_variants WHERE stock_id = ?`,
      [stockId],
    );
  }

  async deleteStockTypes(conn: any, stockId: number) {
    await conn.execute(`DELETE FROM product_stock_types WHERE stock_id = ?`, [
      stockId,
    ]);
  }

  async getLocationPath(locationId: number, businessId: number) {
    const path: any[] = [];

    let currentId = locationId;

    while (currentId) {
      const [rows]: any = await pool.execute(
        `SELECT id, name, parent_id, level_id
       FROM storage_locations
       WHERE id = ? AND business_id = ?`,
        [currentId, businessId],
      );

      if (!rows.length) break;

      const node = rows[0];

      path.unshift(node);
      currentId = node.parent_id;
    }

    return path;
  }
}
