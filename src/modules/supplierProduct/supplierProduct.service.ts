import { BusinessError } from "../../utils/appError";
import axios from "axios";
import { SupplierProductRepository } from "./supplierProduct.repository";
import * as authRepo from "../../modules/auth/auth.repository";
import { getAuthHeaders } from "../../utils/getAuthHeaders";
import { SupplierService } from "../suppliers/supplier.service";
import { getAllBusinesses } from "../business/business.service";

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
      throw new BusinessError("Please select Product & Variant Type...");
    }

    if (item.cost_price == null || item.cost_price < 0) {
      throw new BusinessError("Invalid cost_price");
    }

    if (!allowedStatus.includes(item.stock_status)) {
      throw new BusinessError("Invalid stock_status");
    }

    if (item.stock_status === "order_based") {
      if (!item.pay_advance) {
        throw new BusinessError("pay_advance required for order_based");
      }

      if (!item.lead_days) {
        throw new BusinessError("lead_days required for order_based");
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
      throw new BusinessError("Invalid data format");
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
        throw new BusinessError("Duplicate product + variant in request");
      }

      seen.add(key);

      this.validate(item);
    }

    return await this.repo.bulkInsert(enriched, userId);
  }

  // 🔹 LIST
  async getAll(userId: number) {
    const businessRes = await getAllBusinesses(userId);

    const businessList = businessRes?.data || [];

    const supplierMap = new Map(
      businessList.map((s: any) => {
        const key = Number(s.id);

        const name =
          s.business_name?.trim() ||
          s.company_name?.trim() ||
          s.supplier_name?.trim() ||
          `Business ${s.id}`;

        return [key, name];
      }),
    );

    const rows = await this.repo.getAll();

    return rows.map((r: any) => ({
      ...r,

      supplier_name: supplierMap.get(Number(r.supplier_id)) || "Unknown",
    }));
  }

  async getMyProducts(userId: number, supplierId: number) {
    const businessRes = await getAllBusinesses(userId);

    const businessList = businessRes?.data || [];

    const supplierMap = new Map(
      businessList.map((s: any) => {
        const key = Number(s.id);

        const name =
          s.business_name?.trim() ||
          s.company_name?.trim() ||
          s.supplier_name?.trim() ||
          `Business ${s.id}`;

        return [key, name];
      }),
    );

    const rows = await this.repo.getBySupplierId(supplierId);

    return rows.map((r: any) => ({
      ...r,

      supplier_name: supplierMap.get(Number(r.supplier_id)) || "Unknown",
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
      throw new BusinessError("Record not found");
    }

    // 🔒 ownership check
    if (existing.supplier_id !== supplierId) {
      throw new BusinessError("Unauthorized");
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
