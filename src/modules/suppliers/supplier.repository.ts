import pool from "../../config/db";

export class SupplierRepository {

  async createSupplier(businessId:number,data:any){

    const {
      name,
      phone,
      email,
      address,
      min_purchase_qty,
      max_purchase_qty
    } = data;

    const [result]:any = await pool.execute(
      `INSERT INTO suppliers
      (business_id,name,phone,email,address,min_purchase_qty,max_purchase_qty)
      VALUES (?,?,?,?,?,?,?)`,
      [
        businessId,
        name,
        phone,
        email,
        address,
        min_purchase_qty,
        max_purchase_qty
      ]
    );

    return result.insertId;
  }

  async getSuppliers(businessId:number){

    const [rows]:any = await pool.execute(
      `SELECT * FROM suppliers
       WHERE business_id=?`,
      [businessId]
    );

    return rows;
  }

  async updateSupplier(id:number,businessId:number,data:any){

    const {
      name,
      phone,
      email,
      address,
      min_purchase_qty,
      max_purchase_qty
    } = data;

    const [result]:any = await pool.execute(
      `UPDATE suppliers
       SET name=?,phone=?,email=?,address=?,min_purchase_qty=?,max_purchase_qty=?
       WHERE id=? AND business_id=?`,
      [
        name,
        phone,
        email,
        address,
        min_purchase_qty,
        max_purchase_qty,
        id,
        businessId
      ]
    );

    return result.affectedRows;
  }

  async deleteSupplier(id:number,businessId:number){

    const [result]:any = await pool.execute(
      `DELETE FROM suppliers
       WHERE id=? AND business_id=?`,
      [id,businessId]
    );

    return result.affectedRows;
  }

}