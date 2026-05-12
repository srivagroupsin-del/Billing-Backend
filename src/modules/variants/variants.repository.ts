import pool from "../../config/db";

export class VariantsRepository {
  async getAll(businessId: number) {
    const [rows] = await pool.query(
      `SELECT id, name 
       FROM product_variant_master 
       WHERE business_id = ? AND is_deleted = 0
       ORDER BY id ASC`,
      [businessId]
    );
    return rows;
  }
}