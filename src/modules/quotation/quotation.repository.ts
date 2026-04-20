import { PoolConnection } from "mysql2/promise";
import pool from "../../config/db";

export class QuotationRepository {
  // 🔹 CREATE QUOTATION
  async createQuotation(conn: PoolConnection, data: any, userId: number) {
    const [result]: any = await conn.query(
      `INSERT INTO quotations 
      (supplier_id, request_date, validity_date, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?)`,
      [data.supplier_id, data.request_date, data.validity_date, userId, userId],
    );

    return result.insertId;
  }

  // 🔹 INSERT ITEMS (SAFE)
  async insertItems(conn: PoolConnection, quotationId: number, items: any[]) {
    if (!items || items.length === 0) return;

    // optional duplicate check
    const ids = items.map((i) => i.supplier_product_mapping_id);
    const unique = new Set(ids);
    if (ids.length !== unique.size) {
      throw new Error("Duplicate products in quotation");
    }

    const values = items.map((item) => [
      quotationId,
      item.supplier_product_mapping_id,
      item.quantity,
      item.target_price || 0,
      item.notes || null,
      item.additional_charges || 0,
      item.tax || 0,
      item.packing || 0,
      item.delivery || 0,
    ]);

    await conn.query(
      `INSERT INTO quotation_items
      (quotation_id, supplier_product_mapping_id, quantity, target_price, notes,
       additional_charges, tax, packing, delivery)
      VALUES ?`,
      [values],
    );
  }

  // 🔹 GET ALL
  async getAll() {
    const [rows] = await pool.query(
      `SELECT q.*, 
        (SELECT COUNT(*) FROM quotation_items qi 
         WHERE qi.quotation_id = q.id AND qi.is_deleted = 0) as item_count
       FROM quotations q
       WHERE q.is_deleted = 0
       ORDER BY q.id DESC`,
    );

    return rows;
  }

  // 🔹 GET BY ID
  async getById(id: number) {
    const [quotation]: any = await pool.query(
      `SELECT * FROM quotations WHERE id = ? AND is_deleted = 0`,
      [id],
    );

    if (!quotation.length) throw new Error("Not found");

    const [items] = await pool.query(
      `SELECT * FROM quotation_items 
       WHERE quotation_id = ? AND is_deleted = 0
       ORDER BY id ASC`,
      [id],
    );

    return {
      ...quotation[0],
      items,
    };
  }

  // 🔹 UPDATE MASTER (SAFE PARTIAL)
  async updateQuotation(
    conn: PoolConnection,
    id: number,
    data: any,
    userId: number,
  ) {
    await conn.query(
      `UPDATE quotations SET
        supplier_id = COALESCE(?, supplier_id),
        request_date = COALESCE(?, request_date),
        validity_date = COALESCE(?, validity_date),
        updated_by = ?
       WHERE id = ? AND is_deleted = 0`,
      [
        data.supplier_id ?? null,
        data.request_date ?? null,
        data.validity_date ?? null,
        userId,
        id,
      ],
    );
  }

  // 🔹 SOFT DELETE ALL ITEMS (FOR UPDATE FLOW)
  async softDeleteItems(conn: PoolConnection, quotationId: number) {
    await conn.query(
      `UPDATE quotation_items
       SET is_deleted = 1, deleted_at = NOW()
       WHERE quotation_id = ? AND is_deleted = 0`,
      [quotationId],
    );
  }

  // 🔹 DELETE FULL QUOTATION
  async softDelete(id: number) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      await conn.query(
        `UPDATE quotations 
         SET is_deleted = 1, deleted_at = NOW()
         WHERE id = ?`,
        [id],
      );

      await conn.query(
        `UPDATE quotation_items
         SET is_deleted = 1, deleted_at = NOW()
         WHERE quotation_id = ?`,
        [id],
      );

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  // 🔹 UPDATE STATUS (FIXED)
  async updateStatus(id: number, status: string, userId: number) {
    const [result]: any = await pool.query(
      `UPDATE quotations 
       SET status = ?, updated_at = NOW(), updated_by = ?
       WHERE id = ? AND is_deleted = 0`,
      [status, userId, id],
    );

    return result;
  }

  // 🔹 DELETE SINGLE ITEM (SAFE)
  async softDeleteItem(itemId: number, quotationId: number) {
    const [result]: any = await pool.query(
      `UPDATE quotation_items
       SET is_deleted = 1, deleted_at = NOW()
       WHERE id = ? AND quotation_id = ? AND is_deleted = 0`,
      [itemId, quotationId],
    );

    return result;
  }
}
