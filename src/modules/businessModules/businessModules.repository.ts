import pool from "../../config/db";

export class BusinessModulesRepository {
  /* MODULES */

  async createModule(businessId: number, name: string) {
    try {
      const [result]: any = await pool.execute(
        `INSERT INTO business_modules (business_id, name)
       VALUES (?, ?)`,
        [businessId, name],
      );

      return result.insertId;
    } catch (err: any) {
      if (err.code === "ER_DUP_ENTRY") {
        throw new Error("Module already exists for this business");
      }
      throw err;
    }
  }

  async getModules(businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM business_modules
       WHERE business_id = ?`,
      [businessId],
    );
    return rows;
  }

  async updateModule(id: number, businessId: number, name: string) {
    try {
      const [result]: any = await pool.execute(
        `UPDATE business_modules
       SET name = ?
       WHERE id = ? AND business_id = ?`,
        [name, id, businessId],
      );

      return result.affectedRows;
    } catch (err: any) {
      if (err.code === "ER_DUP_ENTRY") {
        throw new Error("Module already exists for this business");
      }
      throw err;
    }
  }

  async deleteModule(id: number, businessId: number) {
    const [result]: any = await pool.execute(
      `DELETE FROM business_modules
       WHERE id = ? AND business_id = ?`,
      [id, businessId],
    );
    return result.affectedRows;
  }

  /* MODULE ITEMS */

  async createModuleItem(businessId: number, moduleId: number, name: string) {
    const [result]: any = await pool.execute(
      `INSERT INTO business_module_items (module_id, business_id, name)
       VALUES (?, ?, ?)`,
      [moduleId, businessId, name],
    );
    return result.insertId;
  }

  async getModuleItems(businessId: number, moduleId: number) {
    const [rows]: any = await pool.execute(
      `SELECT *
       FROM business_module_items
       WHERE business_id = ? AND module_id = ?`,
      [businessId, moduleId],
    );
    return rows;
  }

  async updateModuleItem(id: number, businessId: number, name: string) {
    const [result]: any = await pool.execute(
      `UPDATE business_module_items
       SET name = ?
       WHERE id = ? AND business_id = ?`,
      [name, id, businessId],
    );
    return result.affectedRows;
  }

  async deleteModuleItem(id: number, businessId: number) {
    const [result]: any = await pool.execute(
      `DELETE FROM business_module_items
       WHERE id = ? AND business_id = ?`,
      [id, businessId],
    );
    return result.affectedRows;
  }
}
