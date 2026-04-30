import axios from "axios";
import { SupplierProductRepository } from "./supplierProduct.repository";
import * as authRepo from "../../modules/auth/auth.repository";

type SupplierProductInput = {
  product_id: number;
  variant_id: number;
  cost_price: number;
  stock_status: "in_stock" | "out_of_stock" | "order_based";
  pay_advance?: number | null;
  lead_days?: number | null;
  lead_days_type?: string;
};

export class SupplierProductService {
  private repo = new SupplierProductRepository();

  // 🔥 VALIDATION
  validate(item: SupplierProductInput) {
    const allowedStatus = ["in_stock", "out_of_stock", "order_based"];

    if (!item.product_id || !item.variant_id) {
      throw new Error("product_id & variant_id required");
    }

    if (item.cost_price == null || item.cost_price < 0) {
      throw new Error("Invalid cost_price");
    }

    if (!allowedStatus.includes(item.stock_status)) {
      throw new Error("Invalid stock_status");
    }

    if (item.stock_status === "order_based") {
      if (!item.pay_advance) {
        throw new Error("pay_advance required for order_based");
      }

      if (!item.lead_days) {
        throw new Error("lead_days required for order_based");
      }
    } else {
      item.pay_advance = null;
      item.lead_days = null;
    }
  }

  // 🔹 CREATE BULK
  async createBulk(
    data: SupplierProductInput[],
    userId: number,
    supplierId: number,
  ) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid data format");
    }

    // 🔥 inject supplier_id
    const enriched = data.map((item) => ({
      ...item,
      supplier_id: supplierId,
    }));

    // 🔥 duplicate check
    const seen = new Set<string>();

    for (const item of enriched) {
      const key = `${item.product_id}-${item.variant_id}`;

      if (seen.has(key)) {
        throw new Error("Duplicate product + variant in request");
      }

      seen.add(key);

      this.validate(item);
    }

    return await this.repo.bulkInsert(enriched, userId);
  }

  // 🔹 LIST
  async getAll(userId: number) {
    const user = await authRepo.getUserById(userId);

    const supplierRes = await axios.get(
      "https://user.jobes24x7.com/api/suppliers",
      {
        headers: {
          Authorization: `Bearer ${user.central_token}`,
        },
      },
    );

    const supplierList = supplierRes.data?.data?.data || [];

    const supplierMap = new Map(
      supplierList.map((s: any) => {
        const key = s.business_cre_id || Number(String(s.id).split("-")[1]);

        const name =
          s.business_name || s.supplier_name || s.company_name || "Unknown";

        return [key, name];
      }),
    );

    const rows = await this.repo.getAll();

    return rows.map((r: any) => ({
      ...r,
      supplier_name: supplierMap.get(r.supplier_id) || null,
    }));
  }

  async getMyProducts(userId: number, supplierId: number) {
    const user = await authRepo.getUserById(userId);

    const supplierRes = await axios.get(
      "https://user.jobes24x7.com/api/suppliers",
      {
        headers: {
          Authorization: `Bearer ${user.central_token}`,
        },
      },
    );

    const supplierList = supplierRes.data?.data?.data || [];

    const supplierMap = new Map(
      supplierList.map((s: any) => {
        const key = s.business_cre_id || Number(String(s.id).split("-")[1]);

        const name =
          s.business_name || s.supplier_name || s.company_name || "Unknown";

        return [key, name];
      }),
    );

    const rows = await this.repo.getBySupplierId(supplierId);

    return rows.map((r: any) => ({
      ...r,
      supplier_name: supplierMap.get(r.supplier_id) || null,
    }));
  }

  // 🔹 UPDATE
  async update(
    id: number,
    data: Partial<SupplierProductInput>,
    userId: number,
    supplierId: number,
  ) {
    const existing = await this.repo.getById(id);

    if (!existing) {
      throw new Error("Record not found");
    }

    // 🔒 ownership check
    if (existing.supplier_id !== supplierId) {
      throw new Error("Unauthorized");
    }

    // 🔥 lock product & variant
    const merged = {
      ...existing,
      ...data,
      supplier_id: supplierId,
      product_id: existing.product_id,
      variant_id: existing.variant_id,
    };

    this.validate(merged);

    return await this.repo.update(id, merged, userId);
  }

  // 🔹 DELETE
  async softDelete(id: number, supplierId: number) {
    return await this.repo.softDelete(id, supplierId);
  }
}
