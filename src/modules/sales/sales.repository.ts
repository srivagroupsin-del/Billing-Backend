import pool from "../../config/db";

export class SalesRepository {
  async generateBillNumber(connection: any, businessId: number) {
    const [rows]: any = await connection.execute(
      `SELECT bill_number
      FROM sales_bills
      WHERE business_id = ?
      ORDER BY id DESC
      LIMIT 1`,
      [businessId],
    );
    let next = 1;
    if (rows.length > 0) {
      const lastBill = rows[0].bill_number;
      const number = parseInt(lastBill.split("-")[1]);
      next = number + 1;
    }
    return `BILL-${String(next).padStart(5, "0")}`;
  }

  async validateStockType(connection: any, stockId: number, typeId: number) {
    const [rows]: any = await connection.execute(
      `SELECT id 
     FROM product_stock_types
     WHERE stock_id = ? AND stock_type_id = ?`,
      [stockId, typeId],
    );

    return rows.length > 0;
  }

  async checkVariantStock(connection: any, stockId: number, variantId: number) {
    const [rows]: any = await connection.execute(
      `SELECT qty
      FROM product_stock_variants
      WHERE stock_id = ? AND variant_id = ?`,
      [stockId, variantId],
    );
    return rows[0]?.qty || 0;
  }

  async checkStockTypeQty(connection: any, stockId: number, typeId: number) {
    const [rows]: any = await connection.execute(
      `SELECT qty
     FROM product_stock_types
     WHERE stock_id = ? AND stock_type_id = ?`,
      [stockId, typeId],
    );

    return rows[0]?.qty || 0;
  }

  async createBill(connection: any, businessId: number, data: any) {
    const {
      external_customer_id,
      customer_type,
      customer_name,
      customer_phone,
      customer_meta,
      bill_number,
      total_amount,
      discount,
      tax,
      final_amount,
      payment_method,
    } = data;

    const [result]: any = await connection.execute(
      `INSERT INTO sales_bills
    (business_id, external_customer_id, customer_type, customer_name, customer_phone,customer_meta, bill_number, total_amount, discount, tax, final_amount, payment_method)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        businessId,
        external_customer_id,
        customer_type,
        customer_name,
        customer_phone,
        customer_meta,
        bill_number,
        total_amount,
        discount,
        tax,
        final_amount,
        payment_method,
      ],
    );

    return result.insertId;
  }

  async insertBillItems(connection: any, billId: number, items: any[]) {
    const values = items.map((i) => [
      billId,
      i.product_id,
      i.variant_id,
      i.stock_type_id,
      i.price,
      i.qty,
      i.total,
    ]);

    await connection.query(
      `INSERT INTO sales_bill_items
      (bill_id,product_id,variant_id,stock_type_id,price,qty,total)
      VALUES ?`,
      [values],
    );
  }

  async reduceVariantStockSafe(
    connection: any,
    stockId: number,
    variantId: number,
    qty: number,
  ) {
    const [result]: any = await connection.execute(
      `UPDATE product_stock_variants
     SET qty = qty - ?
     WHERE stock_id = ?
     AND variant_id = ?
     AND qty >= ?`,
      [qty, stockId, variantId, qty],
    );

    if (result.affectedRows === 0) {
      throw new Error("Variant stock not available");
    }
  }
  async reduceStockTypeSafe(
    connection: any,
    stockId: number,
    typeId: number,
    qty: number,
  ) {
    const [result]: any = await connection.execute(
      `UPDATE product_stock_types
     SET qty = qty - ?
     WHERE stock_id = ?
     AND stock_type_id = ?
     AND qty >= ?`,
      [qty, stockId, typeId, qty],
    );

    if (result.affectedRows === 0) {
      throw new Error("Stock type not available");
    }
  }
  async getBillByNumber(
    connection: any,
    businessId: number,
    billNumber: string,
  ) {
    const [rows]: any = await connection.execute(
      `SELECT *
     FROM sales_bills
     WHERE bill_number = ? AND business_id = ?`,
      [billNumber, businessId],
    );

    return rows[0] || null;
  }

  async getBillById(connection: any, businessId: number, billId: number) {
    const [rows]: any = await connection.execute(
      `SELECT *
     FROM sales_bills
     WHERE id = ? AND business_id = ?`,
      [billId, businessId],
    );

    return rows[0] || null;
  }

  async getBillItems(connection: any, billId: number) {
    const [rows]: any = await connection.execute(
      `SELECT
      product_id,
      variant_id,
      stock_type_id,
      price,
      qty,
      total
     FROM sales_bill_items
     WHERE bill_id = ?`,
      [billId],
    );

    return rows;
  }

  async getBillsByBusiness(connection: any, businessId: number) {
    const [rows]: any = await connection.execute(
      `SELECT
      id,
      bill_number,
      total_amount,
      discount,
      tax,
      final_amount,
      payment_method,
      created_at
     FROM sales_bills
     WHERE business_id = ?
     ORDER BY id DESC`,
      [businessId],
    );

    return rows;
  }

  async getFullBillDetails(
    connection: any,
    businessId: number,
    billId: number,
  ) {
    // 🔹 1. Get Bill (NO JOIN)
    const [billRows]: any = await connection.execute(
      `SELECT * 
     FROM sales_bills
     WHERE id = ? AND business_id = ?`,
      [billId, businessId],
    );

    if (billRows.length === 0) return null;

    const bill = billRows[0];

    // 🔹 2. Items (KEEP THIS ✅)
    const [items]: any = await connection.execute(
      `SELECT 
      sbi.*,

      p.product_name,
      v.name as variant_name,
      st.name as stock_type_name

     FROM sales_bill_items sbi

     LEFT JOIN srivagroupsin_product_db_2.products p 
       ON p.id = sbi.product_id

     LEFT JOIN variants v 
       ON v.id = sbi.variant_id

     LEFT JOIN stock_types st 
       ON st.id = sbi.stock_type_id

     WHERE sbi.bill_id = ?`,
      [billId],
    );

    // 🔹 3. Movements (KEEP ✅)
    const [movements]: any = await connection.execute(
      `SELECT 
      sm.*,
      sl.name as location_name
     FROM stock_movements sm
     LEFT JOIN storage_locations sl
       ON sl.id = sm.storage_location_id
     WHERE sm.reference_type = 'SALE_BILL'
     AND sm.reference_id = ?
     AND (sl.id IS NULL OR sl.is_deleted = 0)
`,
      [billId],
    );

    return {
      bill,

      // 🔥 FIXED CUSTOMER OBJECT
      customer: {
        id: bill.external_customer_id,
        type: bill.customer_type,
        name: bill.customer_name,
        phone: bill.customer_phone,
      },

      items,
      movements,
    };
  }
}
