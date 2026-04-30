import { PoolConnection } from "mysql2/promise";
import pool from "../../config/db";

export class QuotationRepository {
  async updateQuotationCode(conn: PoolConnection, id: number, code: string) {
    await conn.query(`UPDATE quotations SET quotation_code=? WHERE id=?`, [
      code,
      id,
    ]);
  }

  async createQuotation(conn: PoolConnection, data: any, userId: number) {
    const [result]: any = await conn.query(
      `INSERT INTO quotations 
      (supplier_id, request_date, validity_date, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?)`,
      [data.supplier_id, data.request_date, data.validity_date, userId, userId],
    );

    return result.insertId;
  }

  async insertItems(conn: PoolConnection, quotationId: number, items: any[]) {
    if (!items || items.length === 0) return;

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

  async getBySupplierId(supplierId: number) {
    await pool.query("SET SESSION group_concat_max_len = 10000");

    const [rows]: any = await pool.query(
      `
    SELECT 
      q.id,
      q.quotation_code,
      q.request_date,
      q.validity_date,
      q.status,

      COALESCE(SUM(qi.quantity), 0) as total_qty,
      COALESCE(SUM(qi.quantity * qi.target_price), 0) as total_amount,

      GROUP_CONCAT(
        DISTINCT CONCAT(
          COALESCE(p.product_name,''), ' (', COALESCE(p.model,''), ') - ',
          COALESCE(vm.name,'')
        )
        SEPARATOR ', '
      ) as products

    FROM quotations q

    LEFT JOIN quotation_items qi 
      ON qi.quotation_id = q.id AND qi.is_deleted = 0

    LEFT JOIN supplier_product_mapping spm
      ON spm.id = qi.supplier_product_mapping_id

    LEFT JOIN srivagroupsin_product_db_2.product p
      ON p.id = spm.product_id

    LEFT JOIN product_variant_master vm
      ON vm.id = spm.variant_id

    WHERE q.supplier_id = ?   -- ✅ FILTER

    AND q.is_deleted = 0

    GROUP BY q.id
    ORDER BY q.id DESC
    `,
      [supplierId],
    );

    return rows;
  }

  async getAll() {
    await pool.query("SET SESSION group_concat_max_len = 10000");

    const [rows]: any = await pool.query(
      `
    SELECT 
      q.id,
      q.supplier_id,
      q.quotation_code,
      q.request_date,
      q.validity_date,
      q.status,

      COALESCE(SUM(qi.quantity), 0) as total_qty,
      COALESCE(SUM(qi.quantity * qi.target_price), 0) as total_amount,

      GROUP_CONCAT(
        DISTINCT CONCAT(
          COALESCE(p.product_name,''), ' (', COALESCE(p.model,''), ') - ',
          COALESCE(vm.name,'')
        )
        SEPARATOR ', '
      ) as products

    FROM quotations q

    LEFT JOIN quotation_items qi 
      ON qi.quotation_id = q.id AND qi.is_deleted = 0

    LEFT JOIN supplier_product_mapping spm
      ON spm.id = qi.supplier_product_mapping_id

    LEFT JOIN srivagroupsin_product_db_2.product p
      ON p.id = spm.product_id

    LEFT JOIN product_variant_master vm
      ON vm.id = spm.variant_id

    WHERE q.is_deleted = 0   -- ❌ NO supplier filter

    GROUP BY q.id
    ORDER BY q.id DESC
    `,
    );

    return rows;
  }

  async getById(id: number, supplierId: number) {
    const [q]: any = await pool.query(
      `SELECT * FROM quotations 
     WHERE id=? AND supplier_id=? AND is_deleted=0`,
      [id, supplierId],
    );

    if (!q.length) throw new Error("Not found");

    const [items]: any = await pool.query(
      `
    SELECT 
      qi.id,
      qi.quantity,
      qi.target_price,
      qi.notes,
      qi.additional_charges,
      qi.tax,
      qi.packing,
      qi.delivery,
      (qi.quantity * qi.target_price) as item_total,
      p.product_name,
      p.model,
      vm.name as variant_name
      
    FROM quotation_items qi

    LEFT JOIN supplier_product_mapping spm
      ON spm.id = qi.supplier_product_mapping_id

    LEFT JOIN srivagroupsin_product_db_2.product p
      ON p.id = spm.product_id

    LEFT JOIN product_variant_master vm
      ON vm.id = spm.variant_id

    WHERE qi.quotation_id=? 
      AND qi.is_deleted=0

    ORDER BY qi.id ASC
    `,
      [id],
    );

    return {
      ...q[0],
      items,
    };
  }

  async updateQuotation(
    conn: PoolConnection,
    id: number,
    data: any,
    userId: number,
    supplierId: number,
  ) {
    await conn.query(
      `UPDATE quotations SET
        request_date = COALESCE(?, request_date),
        validity_date = COALESCE(?, validity_date),
        updated_by = ?
       WHERE id=? AND supplier_id=? AND is_deleted=0`,
      [
        data.request_date ?? null,
        data.validity_date ?? null,
        userId,
        id,
        supplierId,
      ],
    );
  }

  async softDeleteItems(conn: PoolConnection, quotationId: number) {
    await conn.query(
      `UPDATE quotation_items 
       SET is_deleted=1, deleted_at=NOW()
       WHERE quotation_id=?`,
      [quotationId],
    );
  }

  async softDelete(id: number, supplierId: number) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      await conn.query(
        `UPDATE quotations SET is_deleted=1, deleted_at=NOW()
         WHERE id=? AND supplier_id=?`,
        [id, supplierId],
      );

      await conn.query(
        `UPDATE quotation_items SET is_deleted=1, deleted_at=NOW()
         WHERE quotation_id=?`,
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

  async updateStatus(
    id: number,
    status: string,
    userId: number,
    supplierId: number,
  ) {
    await pool.query(
      `UPDATE quotations 
       SET status=?, updated_by=?
       WHERE id=? AND supplier_id=?`,
      [status, userId, id, supplierId],
    );
  }

  async softDeleteItem(
    itemId: number,
    quotationId: number,
    supplierId: number,
  ) {
    await pool.query(
      `UPDATE quotation_items qi
       JOIN quotations q ON q.id = qi.quotation_id
       SET qi.is_deleted=1, qi.deleted_at=NOW()
       WHERE qi.id=? AND qi.quotation_id=? AND q.supplier_id=?`,
      [itemId, quotationId, supplierId],
    );
  }
}
