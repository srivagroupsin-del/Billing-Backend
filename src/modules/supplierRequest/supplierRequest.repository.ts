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

    const id = res.insertId;

    // 🔹 Step 2: Generate request code
    const year = new Date().getFullYear();
    const paddedId = String(id).padStart(4, "0");

    const requestCode = `REQ-${year}-${paddedId}`;

    // 🔹 Step 3: Update code
    await conn.query(
      `UPDATE supplier_requests SET request_code = ? WHERE id = ?`,
      [requestCode, id],
    );

    return id;
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
    // 🔥 increase limit for this connection
    await pool.query(`SET SESSION group_concat_max_len = 10000`);

    const [rows]: any = await pool.query(
      `
    SELECT 
      sr.id,
      sr.request_code,
      sr.supplier_id,
      sr.status,
      sr.delivery_datetime,

      -- supplier name
      b.name as supplier_name,

      -- totals
      COALESCE(SUM(sri.quantity), 0) as total_qty,
      COALESCE(SUM(sri.quantity * sri.expected_price), 0) as total_amount,

      -- 🔥 product + variant details
      GROUP_CONCAT(
        DISTINCT CONCAT(
          p.product_name, ' (', p.model, ') - ', vm.name
        )
        SEPARATOR ', '
      ) as product_details

    FROM supplier_requests sr

    LEFT JOIN supplier_request_items sri 
      ON sri.request_id = sr.id AND sri.is_deleted = 0

    LEFT JOIN srivagroupsin_product_db_2.product p 
      ON p.id = sri.product_id

    -- 🔥 JOIN VARIANT MASTER
    LEFT JOIN product_variant_master vm
      ON vm.id = sri.variant_id

    LEFT JOIN businesses b 
      ON b.id = sr.supplier_id

    WHERE sr.business_id = ? 
      AND sr.is_deleted = 0

    GROUP BY sr.id

    ORDER BY sr.id DESC
    `,
      [businessId],
    );

    return rows;
  }

  async getReceivedRequests(supplierId: number) {
    // 🔥 avoid GROUP_CONCAT limit
    await pool.query(`SET SESSION group_concat_max_len = 10000`);

    const [rows]: any = await pool.query(
      `
    SELECT 
      sr.id,
      sr.request_code,
      sr.business_id,
      sr.status,
      sr.delivery_datetime,

      -- 🔥 who sent this request
      b.name as business_name,

      -- totals
      COALESCE(SUM(sri.quantity), 0) as total_qty,
      COALESCE(SUM(sri.quantity * sri.expected_price), 0) as total_amount,

      COUNT(sri.id) as item_count,

      -- product + variant details
      GROUP_CONCAT(
        DISTINCT CONCAT(
          p.product_name, ' (', p.model, ') - ', vm.name
        )
        SEPARATOR ', '
      ) as product_details

    FROM supplier_requests sr

    LEFT JOIN supplier_request_items sri 
      ON sri.request_id = sr.id AND sri.is_deleted = 0

    LEFT JOIN srivagroupsin_product_db_2.product p 
      ON p.id = sri.product_id

    LEFT JOIN product_variant_master vm
      ON vm.id = sri.variant_id

    -- 🔥 business who created request
    LEFT JOIN businesses b 
      ON b.id = sr.business_id

    WHERE sr.supplier_id = ? 
      AND sr.is_deleted = 0

    GROUP BY sr.id

    ORDER BY sr.id DESC
    `,
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
