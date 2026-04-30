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
      if (!businessId) throw new Error("Business ID missing");

      if (!data.items || data.items.length === 0) {
        throw new Error("Bill must contain at least one item");
      }

      // 🔥 STEP 1: VALIDATION (ADDED)
      data.items.forEach((i: any) => {
        if (!i.product_id) throw new Error("product_id missing");
        if (!i.stock_id) throw new Error("stock_id missing");
        if (!i.variant_id) throw new Error("variant_id missing");
        if (i.stock_type_id === undefined || i.stock_type_id === null) {
          throw new Error("stock_type_id missing");
        }
        if (!i.qty) throw new Error("qty missing");

        // safe defaults (only for optional fields)
        i.price = i.price ?? 0;
        i.total = i.total ?? 0;
      });

      await connection.beginTransaction();

      const customerId = data.external_customer_id;
      if (!customerId) throw new Error("Customer ID required");

      // 🔹 Generate bill number
      const billNumber = await this.repo.generateBillNumber(
        connection,
        businessId,
      );

      // 🔹 Create bill
      const billId = await this.repo.createBill(connection, businessId, {
        external_customer_id: customerId,
        customer_type: data.customer_type || "USER",
        customer_name: data.customer_name || null,
        customer_phone: data.customer_phone || null,
        customer_meta: data.customer_meta
          ? JSON.stringify(data.customer_meta)
          : null,
        bill_number: billNumber,
        total_amount: data.total_amount,
        discount: data.discount,
        tax: data.tax,
        final_amount: data.final_amount,
        payment_method: data.payment_method,
      });

      // 🔥 STEP 2: STOCK VALIDATION (ADDED)
      for (const item of data.items) {
        const isValidType = await this.repo.validateStockType(
          connection,
          item.stock_id,
          item.variant_id, // ✅ ADD THIS
          item.stock_type_id,
        );

        if (!isValidType) {
          throw new Error(`Invalid stock type for product ${item.product_id}`);
        }

        const variantQty = await this.repo.checkVariantStock(
          connection,
          item.stock_id,
          item.variant_id,
        );

        if (variantQty < item.qty) {
          throw new Error(`Insufficient variant stock`);
        }

        const typeQty = await this.repo.checkStockTypeQty(
          connection,
          item.stock_id,
          item.variant_id, // ✅ ADD THIS
          item.stock_type_id,
        );

        if (typeQty < item.qty) {
          throw new Error(`Insufficient stock type`);
        }
      }

      // 🔹 Insert items
      await this.repo.insertBillItems(connection, billId, data.items);

      // 🔥 STEP 3: REDUCE STOCK
      for (const item of data.items) {
        await this.repo.reduceVariantStockSafe(
          connection,
          item.stock_id,
          item.variant_id,
          item.qty,
        );

        await this.repo.reduceStockTypeSafe(
          connection,
          item.stock_id,
          item.variant_id, // ✅ ADD THIS
          item.stock_type_id,
          item.qty,
        );

        // 🔥 STEP 4: STOCK MOVEMENT (ENTERPRISE)
        await this.movementRepo.createMovement(connection, {
          business_id: businessId,
          product_id: item.product_id,
          stock_id: item.stock_id,
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
