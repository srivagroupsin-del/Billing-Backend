import pool from "../../config/db";

export class VariantsRepository {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT id, name 
       FROM product_variant_master 
       ORDER BY id ASC`
    );
    return rows;
  }
}