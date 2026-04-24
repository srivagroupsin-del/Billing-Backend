import pool from "../../config/db";
import { SupplierRequestRepository } from "./supplierRequest.repository";
import { MovementRepository } from "../../modules/stockMovement/movement.repository";

export class SupplierRequestService {
  private repo = new SupplierRequestRepository();
  private movementRepo = new MovementRepository();

  validate(data: any) {
    if (!data.supplier_id || !data.delivery_datetime) {
      throw new Error("Missing required fields");
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new Error("Items required");
    }

    data.items.forEach((i: any) => {
      if (!i.product_id || !i.variant_id || !i.quantity) {
        throw new Error("Invalid item");
      }
    });
  }

  // 🔥 COMMON VALIDATION FUNCTION
  async validateStockLimits(
    conn: any,
    items: any[],
    businessId: number,
    requestId?: number,
  ) {
    for (const i of items) {
      // 1. allocation config
      const [alloc]: any = await conn.query(
        `SELECT min_sale_qty, max_sale_qty 
         FROM business_product_allocations 
         WHERE business_id = ? AND product_id = ? AND is_active = 1`,
        [businessId, i.product_id],
      );

      if (!alloc.length) {
        throw new Error(`No allocation found for product ${i.product_id}`);
      }

      const { min_sale_qty, max_sale_qty } = alloc[0];

      // 2. current stock
      const [stock]: any = await conn.query(
        `
        SELECT SUM(psv.qty) as total
        FROM product_stock_variants psv
        JOIN product_stock ps ON ps.id = psv.stock_id
        WHERE ps.product_id = ? AND psv.is_deleted = 0
        `,
        [i.product_id],
      );

      const currentStock = stock[0]?.total || 0;

      // 🔥 (OPTIONAL PRO) exclude existing request qty during update
      let existingRequestQty = 0;

      if (requestId) {
        const [existing]: any = await conn.query(
          `SELECT SUM(quantity) as total 
           FROM supplier_request_items 
           WHERE request_id = ? AND product_id = ? AND is_deleted = 0`,
          [requestId, i.product_id],
        );

        existingRequestQty = existing[0]?.total || 0;
      }

      // 3. allowed qty
      const allowedQty = max_sale_qty - (currentStock - existingRequestQty);

      if (allowedQty <= 0) {
        throw new Error(`Stock already full for product ${i.product_id}`);
      }

      if (i.quantity > allowedQty) {
        throw new Error(
          `Max allowed request for product ${i.product_id} is ${allowedQty}`,
        );
      }

      // optional min check
      if (currentStock + i.quantity < min_sale_qty) {
        throw new Error(`Minimum required stock is ${min_sale_qty}`);
      }
    }
  }

  // 🔥 CREATE
  async create(data: any, userId: number, businessId: number) {
    this.validate(data);

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // 🔥 VALIDATE FIRST
      await this.validateStockLimits(conn, data.items, businessId);

      // 🔥 THEN CREATE
      const requestId = await this.repo.create(conn, data, userId, businessId);

      await this.repo.insertItems(conn, requestId, data.items);

      await conn.commit();

      return {
        request_id: requestId,
        request_code: `REQ-${new Date().getFullYear()}-${String(requestId).padStart(4, "0")}`,
      };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async getAll(businessId: number) {
    return await this.repo.getAll(businessId);
  }

  async getReceived(supplierId: number) {
    return await this.repo.getReceivedRequests(supplierId);
  }

  async getById(id: number, businessId: number) {
    const data = await this.repo.getById(id);

    if (data.business_id !== businessId && data.supplier_id !== businessId) {
      throw new Error("Unauthorized access");
    }

    return data;
  }

  // 🔥 UPDATE
  async update(id: number, data: any, userId: number, businessId: number) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      if (
        !data.supplier_id &&
        !data.delivery_datetime &&
        !data.notes &&
        !data.items
      ) {
        throw new Error("Nothing to update");
      }

      // 🔥 VALIDATE WITH EXISTING REQUEST
      if (data.items?.length) {
        await this.validateStockLimits(conn, data.items, businessId, id);
      }

      await this.repo.update(conn, id, data, userId);

      await this.repo.softDeleteItems(conn, id);

      if (data.items?.length) {
        await this.repo.insertItems(conn, id, data.items);
      }

      await conn.commit();

      return { id };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  // 🔥 STATUS (unchanged — already good)
  async updateStatus(
    id: number,
    status: string,
    reason: string,
    userId: number,
    businessId: number,
  ) {
    const allowed = [
      "pending",
      "accepted",
      "partial_accepted",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowed.includes(status)) {
      throw new Error("Invalid status");
    }

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const request = await this.repo.getById(id);

      if (!request) throw new Error("Request not found");

      const isCreator = request.business_id === businessId;
      const isSupplier = request.supplier_id === businessId;

      if (!isCreator && !isSupplier) {
        throw new Error("Unauthorized");
      }

      const currentStatus = request.status;

      if (currentStatus === status) {
        throw new Error("Already in this status");
      }

      const validTransitions: any = {
        pending: ["accepted", "partial_accepted", "cancelled"],
        accepted: ["shipped", "cancelled"],
        partial_accepted: ["shipped", "cancelled"],
        shipped: ["delivered"],
        delivered: [],
        cancelled: [],
      };

      if (!validTransitions[currentStatus]?.includes(status)) {
        throw new Error(
          `Invalid status transition from ${currentStatus} → ${status}`,
        );
      }

      if (isCreator) {
        if (status !== "cancelled") {
          throw new Error("Creator can only cancel request");
        }

        if (["shipped", "delivered"].includes(currentStatus)) {
          throw new Error("Cannot cancel after shipment");
        }
      }

      if (isSupplier) {
        const allowedSupplierStatuses = [
          "accepted",
          "partial_accepted",
          "shipped",
          "delivered",
        ];

        if (!allowedSupplierStatuses.includes(status)) {
          throw new Error("Supplier not allowed");
        }

        if (status === "partial_accepted" && !reason) {
          throw new Error("Reason required");
        }
      }

      await this.repo.updateStatus(id, status, reason || null, userId);

      // 🔥 STOCK MOVEMENT
      if (status === "delivered") {
        for (const item of request.items) {
          if (!item.stock_id) {
            throw new Error(`Stock ID missing for item ${item.id}`);
          }

          await this.movementRepo.createMovement(conn, {
            business_id: request.business_id,
            product_id: item.product_id,
            stock_id: item.stock_id,
            variant_id: item.variant_id,
            stock_type_id: null,
            movement_type: "IN",
            qty: item.quantity,
            storage_location_id: null,
            reference_type: "supplier_request",
            reference_id: id,
          });
        }
      }

      await conn.commit();

      return { id, status };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async softDelete(id: number) {
    return await this.repo.softDelete(id);
  }

  async deleteItem(itemId: number, requestId: number, businessId: number) {
    const request = await this.repo.getById(requestId);

    if (request.business_id !== businessId) {
      throw new Error("Unauthorized");
    }

    return await this.repo.deleteItem(itemId, requestId);
  }
}
