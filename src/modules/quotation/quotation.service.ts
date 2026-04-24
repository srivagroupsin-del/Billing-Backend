import pool from "../../config/db";
import { QuotationRepository } from "./quotation.repository";

export class QuotationService {
  private repo = new QuotationRepository();

  validate(data: any) {
    if (!data.request_date || !data.validity_date) {
      throw new Error("Missing required fields");
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new Error("Items required");
    }

    const ids = data.items.map((i: any) => i.supplier_product_mapping_id);
    if (new Set(ids).size !== ids.length) {
      throw new Error("Duplicate products in quotation");
    }

    data.items.forEach((item: any) => {
      if (!item.supplier_product_mapping_id || !item.quantity) {
        throw new Error("Invalid item data");
      }
    });
  }

  async create(data: any, userId: number, businessId: number) {
    this.validate(data);

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const quotationId = await this.repo.createQuotation(
        conn,
        { ...data, supplier_id: businessId },
        userId,
      );

      const year = new Date().getFullYear();
      const code = `QT-${year}-${quotationId.toString().padStart(5, "0")}`;

      await this.repo.updateQuotationCode(conn, quotationId, code);

      await this.repo.insertItems(conn, quotationId, data.items);

      await conn.commit();

      return { quotation_id: quotationId, quotation_code: code };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async getAll(supplierId: number) {
    return await this.repo.getAll(supplierId);
  }

  async getById(id: number, supplierId: number) {
    return await this.repo.getById(id, supplierId);
  }

  async update(id: number, data: any, userId: number, supplierId: number) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      await this.repo.updateQuotation(conn, id, data, userId, supplierId);
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

  async softDelete(id: number, supplierId: number) {
    return await this.repo.softDelete(id, supplierId);
  }

  async updateStatus(
    id: number,
    status: string,
    userId: number,
    supplierId: number,
  ) {
    const allowed = ["pending", "accepted", "rejected", "expired"];

    if (!allowed.includes(status)) {
      throw new Error("Invalid status");
    }

    return await this.repo.updateStatus(id, status, userId, supplierId);
  }

  async deleteItem(itemId: number, quotationId: number, supplierId: number) {
    return await this.repo.softDeleteItem(itemId, quotationId, supplierId);
  }
}
