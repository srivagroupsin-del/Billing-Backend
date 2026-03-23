import { ProductAllocationRepository } from "./productAllocation.repository";

export class ProductAllocationService {
  private repository: ProductAllocationRepository;

  constructor() {
    this.repository = new ProductAllocationRepository();
  }

    private buildProductTree(rows: any[]) {

    const tree: any = {};

    rows.forEach(row => {

      // Category Group
      if (!tree[row.category_group_id]) {
        tree[row.category_group_id] = {
          CategoryGroupId: row.category_group_id,
          CategoryGrpname: row.category_group_name,
          Categories: {}
        };
      }

      const group = tree[row.category_group_id];

      const categoryType = row.category_type; // Primary / Secondary

      // Category Type
      if (!group.Categories[categoryType]) {
        group.Categories[categoryType] = {};
      }

      // Category
      if (!group.Categories[categoryType][row.category_id]) {
        group.Categories[categoryType][row.category_id] = {
          id: row.category_id,
          name: row.category_name,
          Brand: {}
        };
      }

      const category = group.Categories[categoryType][row.category_id];

      // Brand
      if (!category.Brand[row.brand_id]) {
        category.Brand[row.brand_id] = {
          id: row.brand_id,
          name: row.brand_name,
          Products: []
        };
      }

      const brand = category.Brand[row.brand_id];

      // Product
      brand.Products.push({
        id: row.product_id,
        name: row.product_name,
        Qty: {
          min: row.min_sale_qty,
          max: row.max_sale_qty
        },
        mrp: row.mrp
      });

    });

    return Object.values(tree);

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

