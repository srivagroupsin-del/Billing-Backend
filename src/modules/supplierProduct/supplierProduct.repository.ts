import pool from "../../config/db";

export class SupplierProductRepository {
  async bulkInsert(data: any[], userId: number) {
    const values = data.map((item) => [
      item.supplier_id,
      item.product_id,
      item.cost_price,
      item.stock_status,
      item.pay_advance || null,
      item.lead_days || null,
      item.lead_days_type || "day",
      userId,
      userId,
    ]);

    const query = `
      INSERT INTO supplier_product_mapping
      (
        supplier_id,
        product_id,
        cost_price,
        stock_status,
        pay_advance,
        lead_days,
        lead_days_type,
        created_by,
        updated_by
      )
      VALUES ?
    `;

    const [result]: any = await pool.query(query, [values]);
    return result;
  }

  async getAll() {
    const [rows] = await pool.query(
      `SELECT * FROM supplier_product_mapping WHERE is_deleted = 0 ORDER BY id DESC`,
    );
    return rows;
  }

  async getById(id: number) {
    const [rows]: any = await pool.query(
      `SELECT * FROM supplier_product_mapping 
     WHERE id = ? AND is_deleted = 0`,
      [id],
    );

    return rows[0];
  }

  async update(id: number, data: any, userId: number) {
    const query = `
      UPDATE supplier_product_mapping
      SET
        supplier_id = ?,
        product_id = ?,
        cost_price = ?,
        stock_status = ?,
        pay_advance = ?,
        lead_days = ?,
        lead_days_type = ?,
        updated_by = ?
      WHERE id = ? AND is_deleted = 0
    `;

    const values = [
      data.supplier_id,
      data.product_id,
      data.cost_price,
      data.stock_status,
      data.pay_advance || null,
      data.lead_days || null,
      data.lead_days_type || "day",
      userId,
      id,
    ];

    const [result]: any = await pool.query(query, values);
    return result;
  }

  async softDelete(id: number) {
    const [result]: any = await pool.query(
      `
      UPDATE supplier_product_mapping
      SET is_deleted = 1, deleted_at = NOW()
      WHERE id = ?
      `,
      [id],
    );

    return result;
  }
}
