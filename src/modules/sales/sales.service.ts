import pool from "../../config/db";
import { SalesRepository } from "./sales.repository";
import { MovementRepository } from "../stockMovement/movement.repository";
import { CustomerRepository } from "../customer/customer.repository";

export class SalesService {
  private repo = new SalesRepository();
  private movementRepo = new MovementRepository();
  private customerRepo = new CustomerRepository();

  async createBill(businessId: number, data: any) {
    const connection = await pool.getConnection();

    try {
      if (!businessId) {
        throw new Error("Business ID missing");
      }

      if (!data.items || data.items.length === 0) {
        throw new Error("Bill must contain at least one item");
      }

      await connection.beginTransaction();

      let customerId = null;

      // 🔹 Customer Handling
      if (data.customer_phone) {
        const existingCustomer = await this.customerRepo.findByPhone(
          connection,
          businessId,
          data.customer_phone,
        );

        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          customerId = await this.customerRepo.createCustomer(
            connection,
            businessId,
            data.customer_name,
            data.customer_phone,
          );
        }
      } else {
        const walkIn = await this.customerRepo.getWalkInCustomer(
          connection,
          businessId,
        );

        customerId = walkIn.id;
      }

      // 🔹 Generate Bill Number
      const billNumber = await this.repo.generateBillNumber(
        connection,
        businessId,
      );

      // 🔹 Create Bill
      const billId = await this.repo.createBill(connection, businessId, {
        ...data,
        customer_id: customerId,
        bill_number: billNumber,
      });

      // 🔹 Insert Bill Items
      await this.repo.insertBillItems(connection, billId, data.items);
      // 🔹 Process Stock
      for (const item of data.items) {
        if (!item.product_id || !item.stock_id || !item.variant_id) {
          throw new Error("Invalid bill item data");
        }

        if (item.qty === undefined || item.qty === null) {
          throw new Error("Item quantity missing");
        }

        if (item.stock_type_id === undefined || item.stock_type_id === null) {
          throw new Error("Stock type not selected");
        }

        const stockId = item.stock_id; // ✅ FIRST define this

        // 🔥 VALIDATE STOCK TYPE BELONGS TO STOCK
        const isValidType = await this.repo.validateStockType(
          connection,
          stockId,
          item.stock_type_id,
        );

        if (!isValidType) {
          throw new Error(`Invalid stock type for product ${item.product_id}`);
        }

        // 1. Reduce Variant
        await this.repo.reduceVariantStockSafe(
          connection,
          stockId,
          item.variant_id,
          item.qty,
        );

        // 2. Reduce Stock Type
        await this.repo.reduceStockTypeSafe(
          connection,
          stockId,
          item.stock_type_id,
          item.qty,
        );

        // ✅ 5. Movement
        await this.movementRepo.createMovement(connection, {
          business_id: businessId,
          product_id: item.product_id,
          stock_id: stockId,
          variant_id: item.variant_id,
          stock_type_id: item.stock_type_id,
          movement_type: "SALE",
          qty: -item.qty,
          reference_type: "SALE_BILL",
          reference_id: billId,
        });
      }
      await connection.commit();

      return {
        bill_id: billId,
        bill_number: billNumber,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getBillById(businessId: number, billId: number) {
    const connection = await pool.getConnection();

    try {
      const bill = await this.repo.getBillById(connection, businessId, billId);

      if (!bill) {
        throw new Error("Bill not found");
      }

      const items = await this.repo.getBillItems(connection, billId);

      return {
        ...bill,
        items,
      };
    } finally {
      connection.release();
    }
  }

  async getBillByNumber(businessId: number, billNumber: string) {
    const connection = await pool.getConnection();

    try {
      const bill = await this.repo.getBillByNumber(
        connection,
        businessId,
        billNumber,
      );

      if (!bill) {
        throw new Error("Bill not found");
      }

      const items = await this.repo.getBillItems(connection, bill.id);

      return {
        ...bill,
        items,
      };
    } finally {
      connection.release();
    }
  }

  async getBillsByBusiness(businessId: number) {
    const connection = await pool.getConnection();

    try {
      const bills = await this.repo.getBillsByBusiness(connection, businessId);

      return bills;
    } finally {
      connection.release();
    }
  }

  async getFullBillDetails(businessId: number, billId: number) {
    const connection = await pool.getConnection();

    try {
      // 🔹 1. Get Bill + Customer
      const [billRows]: any = await connection.execute(
        `SELECT 
          sb.*,
          c.name as customer_name,
          c.phone as customer_phone
       FROM sales_bills sb
       LEFT JOIN customers c ON c.id = sb.customer_id
       WHERE sb.id = ? AND sb.business_id = ?`,
        [billId, businessId],
      );

      if (billRows.length === 0) {
        throw new Error("Bill not found");
      }

      const bill = billRows[0];

      // 🔹 2. Get Items
      const [items]: any = await connection.execute(
        `SELECT 
      sbi.id,
      sbi.bill_id,
      sbi.product_id,
      sbi.variant_id,
      sbi.stock_type_id,
      sbi.price,
      sbi.qty,
      sbi.total,

      -- ✅ PRODUCT FROM DIFFERENT DB
      p.product_name,

      -- ✅ SAME DB TABLES
      v.name AS variant_name,
      st.name AS stock_type_name

   FROM sales_bill_items sbi

   LEFT JOIN srivagroupsin_product_db_2.product p
     ON p.id = sbi.product_id

   LEFT JOIN product_variant_master  v
     ON v.id = sbi.variant_id

   LEFT JOIN stock_type_master st
     ON st.id = sbi.stock_type_id

   WHERE sbi.bill_id = ?`,
        [billId],
      );

      // 🔹 3. Get Stock Movements
      const [movements]: any = await connection.execute(
        `SELECT *
       FROM stock_movements
       WHERE reference_type = 'SALE_BILL'
       AND reference_id = ?`,
        [billId],
      );

      return {
        bill,
        customer: {
          id: bill.customer_id,
          name: bill.customer_name,
          phone: bill.customer_phone,
        },
        items,
      };
    } finally {
      connection.release();
    }
  }
}
