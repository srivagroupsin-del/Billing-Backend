import { PoolConnection } from "mysql2/promise";
import pool from "../../config/db";

export class CustomerRepository {
  async getWalkInCustomer(connection: any, businessId: number) {
    const [rows]: any = await connection.execute(
      `SELECT id FROM customers
        WHERE business_id=? AND name='Walk-in Customer'
        LIMIT 1`,
      [businessId],
    );

    return rows[0];
  }
  async findByPhoneOne(businessId: number, phone: string) {
    const [rows]: any = await pool.execute(
      `SELECT id,name,phone
       FROM customers
       WHERE business_id=? AND phone=?`,
      [businessId, phone],
    );

    return rows[0];
  }

  async findByPhone(connection: any, businessId: number, phone: string) {
    const [rows]: any = await connection.execute(
      `SELECT * FROM customers
       WHERE business_id=? AND phone=?`,
      [businessId, phone],
    );

    return rows[0];
  }

  async createCustomer(
    connection: any,
    businessId: number,
    name: string,
    phone: string,
  ) {
    const [result]: any = await connection.execute(
      `INSERT INTO customers
       (business_id,name,phone)
       VALUES (?,?,?)`,
      [businessId, name, phone],
    );

    return result.insertId;
  }

  async getCustomerBybusiness(businessId: number) {
    const [result]: any = await pool.execute(
      `SELECT id,name,phone
     FROM customers
     WHERE business_id = ? OR business_id IS NULL`,
      [businessId],
    );

    return result;
  }
}
