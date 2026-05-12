import pool from "../../config/db";

export class VariantMasterRepository {
  async createVariant(businessId: number, data: any) {
    const { name } = data;

    const [result]: any = await pool.execute(
      `INSERT INTO product_variant_master
       (business_id, name)
       VALUES (?, ?)`,
      [businessId, name],
    );

    return result.insertId;
  }

  async getVariants(businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT *
       FROM product_variant_master
       WHERE business_id = ?
       AND is_deleted = 0`,
      [businessId],
    );

    return rows;
  }

  async updateVariant(id: number, businessId: number, data: any) {
    const { name } = data;

    const [result]: any = await pool.execute(
      `UPDATE product_variant_master
       SET name = ?
       WHERE id = ?
       AND business_id = ?`,
      [name, id, businessId],
    );

    return result.affectedRows;
  }

  async deleteVariant(id: number, businessId: number) {
    const [result]: any = await pool.execute(
      `UPDATE product_variant_master
       SET is_deleted = 1
       WHERE id = ?
       AND business_id = ?`,
      [id, businessId],
    );

    return result.affectedRows;
  }
}
