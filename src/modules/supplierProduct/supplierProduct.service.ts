import { SupplierProductRepository } from "./supplierProduct.repository";

export class SupplierProductService {
  private repo = new SupplierProductRepository();

  validate(item: any) {
    if (!item.supplier_id || !item.product_id || !item.cost_price) {
      throw new Error("Missing required fields");
    }

    if (item.stock_status === "order_based") {
      if (!item.pay_advance) {
        throw new Error("pay_advance required for order_based");
      }
    } else {
      item.pay_advance = null;
    }
  }

  async createBulk(data: any[], userId: number) {
    if (!Array.isArray(data)) {
      throw new Error("Invalid data format");
    }

    data.forEach((item) => this.validate(item));

    return await this.repo.bulkInsert(data, userId);
  }

  async getAll() {
    return await this.repo.getAll();
  }

  async update(id: number, data: any, userId: number) {
    // 1. get existing
    const existing = await this.repo.getById(id);

    if (!existing) {
      throw new Error("Record not found");
    }

    // 2. merge
    const merged = {
      ...existing,
      ...data,
    };

    // 3. validate merged
    this.validate(merged);

    // 4. update
    return await this.repo.update(id, merged, userId);
  }

  async softDelete(id: number) {
    return await this.repo.softDelete(id);
  }
}
