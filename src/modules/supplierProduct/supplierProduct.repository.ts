import pool from "../../config/db";

export class SupplierProductRepository {
  // 🔹 BULK INSERT
  async bulkInsert(data: any[], userId: number) {
    const values = data.map((item) => [
      item.supplier_id,
      item.product_id,
      item.variant_id,
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
        variant_id,
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

  // 🔹 GET ALL (ENRICHED)
  async getAll() {
    const [rows]: any = await pool.query(`
      SELECT 
        spm.id,
        spm.cost_price,
        spm.stock_status,
        spm.pay_advance,
        spm.lead_days,
        spm.lead_days_type,

        b.name as supplier_name,
        p.product_name,
        p.model,
        vm.name as variant_name

      FROM supplier_product_mapping spm

      LEFT JOIN businesses b
        ON b.id = spm.supplier_id

      LEFT JOIN srivagroupsin_product_db_2.product p
        ON p.id = spm.product_id

      LEFT JOIN product_variant_master vm
        ON vm.id = spm.variant_id

      WHERE spm.is_deleted = 0

      ORDER BY spm.id DESC
    `);

    return rows;
  }

  // 🔹 GET BY ID
  async getById(id: number) {
    const [rows]: any = await pool.query(
      `SELECT * FROM supplier_product_mapping 
       WHERE id = ? AND is_deleted = 0`,
      [id],
    );

    return rows[0];
  }

  // 🔹 UPDATE
  async update(id: number, data: any, userId: number) {
    const [result]: any = await pool.query(
      `
      UPDATE supplier_product_mapping
      SET
        cost_price = ?,
        stock_status = ?,
        pay_advance = ?,
        lead_days = ?,
        lead_days_type = ?,
        updated_by = ?
      WHERE id = ? AND is_deleted = 0
      `,
      [
        data.cost_price,
        data.stock_status,
        data.pay_advance || null,
        data.lead_days || null,
        data.lead_days_type || "day",
        userId,
        id,
      ],
    );

    return result;
  }

  // 🔹 DELETE
  async softDelete(id: number, supplierId: number) {
    const [result]: any = await pool.query(
      `
      UPDATE supplier_product_mapping
      SET is_deleted = 1, deleted_at = NOW()
      WHERE id = ? AND supplier_id = ?
      `,
      [id, supplierId],
    );

    return result;
  }
}
