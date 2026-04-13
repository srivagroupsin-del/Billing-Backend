import pool from "../../config/db";
import { SalesRepository } from "./sales.repository";
import { MovementRepository } from "../stockMovement/movement.repository";
import { CustomerRepository } from "../customer/customer.repository";
import axios from "axios";

export class SalesService {
  private repo = new SalesRepository();
  private movementRepo = new MovementRepository();

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

      // 🔥 NEW CUSTOMER FLOW (NO API CALL)
      const customerId = data.external_customer_id || null;
      const customerType = data.customer_type || "USER";
      const customerName = data.customer_name || null;
      const customerPhone = data.customer_phone || null;
      const customer_meta = data.customer_meta || null;

      if (!customerId) {
        throw new Error("Customer ID is required");
      }

      // 🔹 Generate Bill Number
      const billNumber = await this.repo.generateBillNumber(
        connection,
        businessId,
      );

      // 🔹 Create Bill
      const billId = await this.repo.createBill(connection, businessId, {
        external_customer_id: customerId,
        customer_type: customerType,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_meta: customer_meta,
        bill_number: billNumber,
        total_amount: data.total_amount,
        discount: data.discount,
        tax: data.tax,
        final_amount: data.final_amount,
        payment_method: data.payment_method,
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

        const stockId = item.stock_id;

        const isValidType = await this.repo.validateStockType(
          connection,
          stockId,
          item.stock_type_id,
        );

        if (!isValidType) {
          throw new Error(`Invalid stock type for product ${item.product_id}`);
        }

        await this.repo.reduceVariantStockSafe(
          connection,
          stockId,
          item.variant_id,
          item.qty,
        );

        await this.repo.reduceStockTypeSafe(
          connection,
          stockId,
          item.stock_type_id,
          item.qty,
        );

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
        customer: {
          id: bill.external_customer_id,
          type: bill.customer_type,
          name: bill.customer_name,
          phone: bill.customer_phone,
          meta:
            typeof bill.customer_meta === "string"
              ? JSON.parse(bill.customer_meta)
              : bill.customer_meta || null,
        },
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
        customer: {
          id: bill.external_customer_id,
          type: bill.customer_type,
          name: bill.customer_name,
          phone: bill.customer_phone,
          meta:
            typeof bill.customer_meta === "string"
              ? JSON.parse(bill.customer_meta)
              : bill.customer_meta || null,
        },
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
      // 🔹 1. Get Bill
      const bill = await this.repo.getBillById(connection, businessId, billId);

      if (!bill) {
        throw new Error("Bill not found");
      }

      // 🔹 2. Get Items
      const items = await this.repo.getBillItems(connection, billId);

      return {
        bill,
        customer: {
          id: bill.external_customer_id,
          type: bill.customer_type,
          name: bill.customer_name,
          phone: bill.customer_phone,
          meta:
            typeof bill.customer_meta === "string"
              ? JSON.parse(bill.customer_meta)
              : bill.customer_meta || null,
        },
        items,
      };
    } finally {
      connection.release();
    }
  }
}
