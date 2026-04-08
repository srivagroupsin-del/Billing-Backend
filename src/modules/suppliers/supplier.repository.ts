import pool from "../../config/db";

export class SupplierRepository {
  // ✅ CREATE SUPPLIER (WITH BRANCHES + ADDRESSES)
  async createSupplier(businessId: number, data: any) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      const { supplier_details, addresses, branches } = data;

      const {
        supplier_name,
        company_name,
        phone_number,
        pan_number,
        gst_status,
      } = supplier_details;

      const { with_gst, gst_number } = gst_status;

      // ✅ Insert supplier
      const [supplierResult]: any = await conn.execute(
        `INSERT INTO suppliers
  (business_id,name,company_name,phone,email,pan_number,gst_number,with_gst)
  VALUES (?,?,?,?,?,?,?,?)`,
        [
          businessId,
          supplier_name,
          company_name,
          phone_number,
          null, // email (not in JSON → keep null or add field)
          pan_number,
          gst_number,
          with_gst,
        ],
      );
      const supplierId = supplierResult.insertId;

      // ✅ Insert branches
      for (const branch of branches || []) {
        await conn.execute(
          `INSERT INTO supplier_branches
          (supplier_id, branch_name, phone)
          VALUES (?,?,?)`,
          [supplierId, branch.branch_name, branch.phone],
        );
      }

      // ✅ Insert addresses
      const p = addresses.permanent_address;
      const c = addresses.current_address;

      await conn.execute(
        `INSERT INTO supplier_addresses
        (supplier_id,address_type,address_line_1,address_line_2,city,state,pincode)
        VALUES (?,?,?,?,?,?,?)`,
        [
          supplierId,
          "permanent",
          p.address_line_1,
          p.address_line_2,
          p.city,
          p.state,
          p.pincode,
        ],
      );

      await conn.execute(
        `INSERT INTO supplier_addresses
        (supplier_id,address_type,address_line_1,address_line_2,city,state,pincode)
        VALUES (?,?,?,?,?,?,?)`,
        [
          supplierId,
          "current",
          c.address_line_1,
          c.address_line_2,
          c.city,
          c.state,
          c.pincode,
        ],
      );

      await conn.commit();
      conn.release();

      return supplierId;
    } catch (err) {
      await conn.rollback();
      conn.release();
      throw err;
    }
  }

  // ✅ GET SUPPLIERS WITH BRANCHES + ADDRESSES
  async getSuppliers(businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT 
      s.*,

      (
        SELECT CONCAT('[', GROUP_CONCAT(
          JSON_OBJECT(
            'branch_id', sb.id,
            'branch_name', sb.branch_name,
            'phone', sb.phone
          )
        ), ']')
        FROM supplier_branches sb
        WHERE sb.supplier_id = s.id
      ) as branches,

      (
        SELECT CONCAT('[', GROUP_CONCAT(
          JSON_OBJECT(
            'type', sa.address_type,
            'address_line_1', sa.address_line_1,
            'city', sa.city
          )
        ), ']')
        FROM supplier_addresses sa
        WHERE sa.supplier_id = s.id
      ) as addresses

    FROM suppliers s
    WHERE s.business_id=?`,
      [businessId],
    );

    return rows;
  }

  // ✅ UPDATE SUPPLIER
  async updateSupplier(id: number, businessId: number, data: any) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      const { supplier_details, addresses, branches } = data;

      const {
        supplier_name,
        company_name,
        phone_number,
        pan_number,
        gst_status,
      } = supplier_details;

      const { with_gst, gst_number } = gst_status;

      // ✅ Update supplier
      await conn.execute(
        `UPDATE suppliers
   SET name=?,company_name=?,phone=?,email=?,pan_number=?,gst_number=?,with_gst=?
   WHERE id=? AND business_id=?`,
        [
          supplier_name,
          company_name,
          phone_number,
          null, // email
          pan_number,
          gst_number,
          with_gst,
          id,
          businessId,
        ],
      );
      // ✅ Delete old branches
      await conn.execute(`DELETE FROM supplier_branches WHERE supplier_id=?`, [
        id,
      ]);

      // ✅ Insert new branches
      for (const branch of branches || []) {
        await conn.execute(
          `INSERT INTO supplier_branches (supplier_id,branch_name,phone)
           VALUES (?,?,?)`,
          [id, branch.branch_name, branch.phone],
        );
      }

      // ✅ Delete old addresses
      await conn.execute(`DELETE FROM supplier_addresses WHERE supplier_id=?`, [
        id,
      ]);

      // ✅ Insert addresses again
      const p = addresses.permanent_address;
      const c = addresses.current_address;

      await conn.execute(
        `INSERT INTO supplier_addresses
        (supplier_id,address_type,address_line_1,address_line_2,city,state,pincode)
        VALUES (?,?,?,?,?,?,?)`,
        [
          id,
          "permanent",
          p.address_line_1,
          p.address_line_2,
          p.city,
          p.state,
          p.pincode,
        ],
      );

      await conn.execute(
        `INSERT INTO supplier_addresses
        (supplier_id,address_type,address_line_1,address_line_2,city,state,pincode)
        VALUES (?,?,?,?,?,?,?)`,
        [
          id,
          "current",
          c.address_line_1,
          c.address_line_2,
          c.city,
          c.state,
          c.pincode,
        ],
      );

      await conn.commit();
      conn.release();

      return true;
    } catch (err) {
      await conn.rollback();
      conn.release();
      throw err;
    }
  }

  // ✅ DELETE
  async deleteSupplier(id: number, businessId: number) {
    const [result]: any = await pool.execute(
      `DELETE FROM suppliers WHERE id=? AND business_id=?`,
      [id, businessId],
    );

    return result.affectedRows;
  }
}
