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

  async create(data: any, userId: number, businessId: number) {
    this.validate(data);

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const requestId = await this.repo.create(conn, data, userId, businessId);

      await this.repo.insertItems(conn, requestId, data.items);

      await conn.commit();

      return { request_id: requestId };
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

  async update(id: number, data: any, userId: number) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

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

      // 🔥 Prevent same status update
      if (currentStatus === status) {
        throw new Error("Already in this status");
      }

      // 🔥 STATUS TRANSITION FLOW
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

      // 🔥 ROLE RULES

      if (isCreator) {
        if (status !== "cancelled") {
          throw new Error("Creator can only cancel request");
        }

        // ❌ cannot cancel after shipped
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
          throw new Error("Supplier not allowed to set this status");
        }

        if (status === "partial_accepted" && !reason) {
          throw new Error("Reason required for partial accept");
        }
      }

      // 🔥 UPDATE STATUS
      await this.repo.updateStatus(id, status, reason || null, userId);

      // 🔥 STOCK MOVEMENT (ONLY ONCE)
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

  async deleteItem(itemId: number, requestId: number) {
    return await this.repo.deleteItem(itemId, requestId);
  }
}
