import pool from "../../config/db";

export class StockTypeRepository {
  async createStockType(businessId: number, data: any) {
    const { name } = data;

    const [result]: any = await pool.execute(
      `INSERT INTO stock_type_master
      (business_id,name)
      VALUES (?,?)`,
      [businessId, name],
    );

    return result.insertId;
  }

  async getStockTypes(businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM stock_type_master
       WHERE business_id=?`,
      [businessId],
    );

    return rows;
  }

  async updateStockType(id: number, businessId: number, data: any) {
    const { name } = data;

    const [result]: any = await pool.execute(
      `UPDATE stock_type_master
       SET name=?
       WHERE id=? AND business_id=?`,
      [name, id, businessId],
    );

    return result.affectedRows;
  }

  async deleteStockType(id: number, businessId: number) {
    const [result]: any = await pool.execute(
      `DELETE FROM stock_type_master
       WHERE id=? AND business_id=?`,
      [id, businessId],
    );

    return result.affectedRows;
  }
  async getStockTypesByStock(businessId: number, stockId: number) {
    const [rows]: any = await pool.execute(
      `SELECT 
        pst.stock_type_id,
        stm.name,
        pst.qty AS available_qty

     FROM product_stock_types pst

     JOIN stock_type_master stm 
       ON stm.id = pst.stock_type_id

     WHERE pst.stock_id = ?
       AND stm.business_id = ?`,
      [stockId, businessId],
    );

    return rows;
  }
}
