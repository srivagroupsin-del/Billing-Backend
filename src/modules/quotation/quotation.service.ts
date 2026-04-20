import pool from "../../config/db";
import { QuotationRepository } from "./quotation.repository";

export class QuotationService {
  private repo = new QuotationRepository();

  validate(data: any) {
    if (!data.supplier_id || !data.request_date || !data.validity_date) {
      throw new Error("Missing required fields");
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new Error("Items required");
    }

    data.items.forEach((item: any) => {
      if (!item.supplier_product_mapping_id || !item.quantity) {
        throw new Error("Invalid item data");
      }
    });
  }

  async create(data: any, userId: number) {
    this.validate(data);

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const quotationId = await this.repo.createQuotation(conn, data, userId);

      await this.repo.insertItems(conn, quotationId, data.items);

      await conn.commit();

      return { quotation_id: quotationId };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async getAll() {
    return await this.repo.getAll();
  }

  async getById(id: number) {
    return await this.repo.getById(id);
  }

  async update(id: number, data: any, userId: number) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // update main
      await this.repo.updateQuotation(conn, id, data, userId);

      // delete old items
      await this.repo.softDeleteItems(conn, id);

      // insert new items
      if (data.items && data.items.length > 0) {
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

  async softDelete(id: number) {
    return await this.repo.softDelete(id);
  }

  async updateStatus(id: number, status: string, userId: number) {
    const allowed = ["pending", "accepted", "rejected", "expired"];

    if (!allowed.includes(status)) {
      throw new Error("Invalid status");
    }

    return await this.repo.updateStatus(id, status, userId);
  }

  async deleteItem(itemId: number, quotationId: number) {
    if (!itemId || !quotationId) {
      throw new Error("Item ID & quotation ID required");
    }

    return await this.repo.softDeleteItem(itemId, quotationId);
  }
}
