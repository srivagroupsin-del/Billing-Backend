import { ProductAllocationRepository } from "./productAllocation.repository";

export class ProductAllocationService {
  private repository: ProductAllocationRepository;

  constructor() {
    this.repository = new ProductAllocationRepository();
  }

  private buildProductTree(rows: any[]) {
    const tree: any = {};

    rows.forEach((row) => {
      // Category Group
      if (!tree[row.category_group_id]) {
        tree[row.category_group_id] = {
          CategoryGroupId: row.category_group_id,
          CategoryGrpname: row.category_group_name,
          Categories: {},
        };
      }

      const group = tree[row.category_group_id];
      const categoryType = row.category_type;

      // Category Type
      if (!group.Categories[categoryType]) {
        group.Categories[categoryType] = {};
      }

      // Category
      if (!group.Categories[categoryType][row.category_id]) {
        group.Categories[categoryType][row.category_id] = {
          id: row.category_id,
          name: row.category_name,
          Brand: {},
        };
      }

      const category = group.Categories[categoryType][row.category_id];

      // Brand
      if (!category.Brand[row.brand_id]) {
        category.Brand[row.brand_id] = {
          id: row.brand_id,
          name: row.brand_name,
          Products: {},
        };
      }

      const brand = category.Brand[row.brand_id];

      // ✅ PRODUCT (deduplicate)
      if (!brand.Products[row.product_id]) {
        brand.Products[row.product_id] = {
          allocation_id: row.allocation_id, // 🔥 ADD THIS LINE
          id: row.product_id,
          name: row.product_name,
          mrp: row.mrp,

          Qty: {
            min: row.min_sale_qty,
            max: row.max_sale_qty,
          },

          // ✅ NEW
          alternative_names: new Set(),
          gst: [],
        };
      }

      const product = brand.Products[row.product_id];

      // ✅ Alternative names
      if (row.alternative_name) {
        product.alternative_names.add(row.alternative_name);
      }

      // ✅ GST
      if (row.tax_id) {
        const exists = product.gst.some((g: any) => g.tax_id === row.tax_id);

        if (!exists) {
          product.gst.push({
            tax_id: row.tax_id,
            gst_variant_id: row.gst_variant_id,
            gst_value: row.gst_value,
            hsn_code: row.hsn_code,
            status: row.tax_status,
          });
        }
      }
    });

    // ✅ FINAL CLEAN CONVERSION
    return Object.values(tree).map((group: any) => ({
      ...group,
      Categories: Object.fromEntries(
        Object.entries(group.Categories).map(([type, cats]: any) => [
          type,
          Object.values(cats).map((cat: any) => ({
            ...cat,
            Brand: Object.values(cat.Brand).map((brand: any) => ({
              ...brand,
              Products: Object.values(brand.Products).map((p: any) => ({
                ...p,
                alternative_names: Array.from(p.alternative_names),
              })),
            })),
          })),
        ]),
      ),
    }));
  }

  async allocateProducts(businessId: number, data: any) {
    return await this.repository.allocateProducts(businessId, data);
  }

  async getAllocatedProducts(businessId: number) {
    const rows = await this.repository.getAllocatedProducts(businessId);

    return this.buildProductTree(rows);
  }

  async updateAllocation(id: number, businessId: number, data: any) {
    return await this.repository.updateAllocation(id, businessId, data);
  }

  async deleteAllocation(id: number, businessId: number) {
    return await this.repository.deleteAllocation(id, businessId);
  }
}
