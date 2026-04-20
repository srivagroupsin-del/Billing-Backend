import { PoolConnection } from "mysql2/promise";
import pool from "../../config/db";

export class SupplierRequestRepository {
  async create(
    conn: PoolConnection,
    data: any,
    userId: number,
    businessId: number,
  ) {
    const [res]: any = await conn.query(
      `INSERT INTO supplier_requests
       (supplier_id, business_id, delivery_datetime, notes, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.supplier_id,
        businessId,
        data.delivery_datetime,
        data.notes || null,
        userId,
        userId,
      ],
    );

    return res.insertId;
  }

  async insertItems(conn: PoolConnection, requestId: number, items: any[]) {
    if (!items.length) return;

    const values = items.map((i) => [
      requestId,
      i.product_id,
      i.variant_id,
      i.quantity,
      i.expected_price || 0,
      i.notes || null,
    ]);

    await conn.query(
      `INSERT INTO supplier_request_items
       (request_id, product_id, variant_id, quantity, expected_price, notes)
       VALUES ?`,
      [values],
    );
  }

  async getAll(businessId: number) {
    const [rows] = await pool.query(
      `SELECT * FROM supplier_requests 
       WHERE business_id=? AND is_deleted=0
       ORDER BY id DESC`,
      [businessId],
    );
    return rows;
  }

  async getReceivedRequests(supplierId: number) {
    const [rows] = await pool.query(
      `SELECT sr.*,
      (SELECT COUNT(*) FROM supplier_request_items sri
       WHERE sri.request_id = sr.id AND sri.is_deleted = 0) as item_count
     FROM supplier_requests sr
     WHERE sr.supplier_id = ? AND sr.is_deleted = 0
     ORDER BY sr.id DESC`,
      [supplierId],
    );

    return rows;
  }

  async getById(id: number) {
    const [req]: any = await pool.query(
      `SELECT * FROM supplier_requests WHERE id=? AND is_deleted=0`,
      [id],
    );

    if (!req.length) throw new Error("Not found");

    const [items] = await pool.query(
      `SELECT * FROM supplier_request_items 
       WHERE request_id=? AND is_deleted=0`,
      [id],
    );

    return { ...req[0], items };
  }

  async update(conn: PoolConnection, id: number, data: any, userId: number) {
    await conn.query(
      `UPDATE supplier_requests SET
        supplier_id = COALESCE(?, supplier_id),
        delivery_datetime = COALESCE(?, delivery_datetime),
        notes = COALESCE(?, notes),
        updated_by = ?
       WHERE id=? AND is_deleted=0`,
      [
        data.supplier_id ?? null,
        data.delivery_datetime ?? null,
        data.notes ?? null,
        userId,
        id,
      ],
    );
  }

  async softDeleteItems(conn: PoolConnection, requestId: number) {
    await conn.query(
      `UPDATE supplier_request_items 
       SET is_deleted=1, deleted_at=NOW()
       WHERE request_id=?`,
      [requestId],
    );
  }

  async updateStatus(
    id: number,
    status: string,
    reason: string | null, // ✅ allow null
    userId: number,
  ) {
    await pool.query(
      `UPDATE supplier_requests 
       SET status=?, partial_reason=?, updated_by=?
       WHERE id=?`,
      [status, reason || null, userId, id],
    );
  }

  async deleteItem(itemId: number, requestId: number) {
    await pool.query(
      `UPDATE supplier_request_items
       SET is_deleted=1, deleted_at=NOW()
       WHERE id=? AND request_id=?`,
      [itemId, requestId],
    );
  }

  async softDelete(id: number) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      await conn.query(
        `UPDATE supplier_requests SET is_deleted=1, deleted_at=NOW() WHERE id=?`,
        [id],
      );

      await conn.query(
        `UPDATE supplier_request_items SET is_deleted=1, deleted_at=NOW() WHERE request_id=?`,
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
}
