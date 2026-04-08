import * as repo from "./GroupCatgeorybrandallProductList.repository";

export const getCategoryGroupMappings = async (
  category_group_ids: number[],
) => {
  const rows: any = await repo.getCategoryGroupMappings(category_group_ids);

  if (!rows || rows.length === 0) {
    return [];
  }

  const grouped: any = {};

  for (const row of rows) {
    const groupId = row.category_group_id;

    if (!grouped[groupId]) {
      grouped[groupId] = {
        category_group_id: groupId,
        category_group_name: row.category_group_name,
        primary_categories: [],
      };
    }
  }

  // Build initial primary list
  for (const row of rows) {
    if (row.category_type === "primary") {
      grouped[row.category_group_id].primary_categories.push({
        id: row.category_id,
        name: row.category_name,
        secondary_categories: [],
      });
    }
  }

  // Attach secondaries (auto inject parent if missing)
  for (const row of rows) {
    if (row.category_type === "secondary") {
      const group = grouped[row.category_group_id];

      let parent = group.primary_categories.find(
        (p: any) => p.id === row.parent_category_id,
      );

      // If parent not found → auto create parent
      if (!parent) {
        parent = {
          id: row.parent_category_id,
          name: row.parent_category_name,
          secondary_categories: [], // ✅ CORRECT
        };
        group.primary_categories.push(parent);
      }

      parent.secondary_categories.push({
        // ✅ CORRECT
        id: row.category_id,
        name: row.category_name,
      });
    }
  }

  return Object.values(grouped);
};

export const getCategoryBrandStructure = async (
  category_group_ids: number[],
) => {
  const rows: any = await repo.getCategoryBrandMappings(category_group_ids);

  if (!rows || rows.length === 0) return [];

  const grouped: any = {};

  for (const row of rows) {
    const groupId = row.category_group_id;

    if (!grouped[groupId]) {
      grouped[groupId] = {
        category_group_id: groupId,
        category_group_name: row.category_group_name,
        primary_categories: [],
      };
    }
  }

  // Create primary
  for (const row of rows) {
    if (row.category_type === "primary") {
      const exists = grouped[row.category_group_id].primary_categories.find(
        (p: any) => p.id === row.category_id,
      );

      if (!exists) {
        grouped[row.category_group_id].primary_categories.push({
          id: row.category_id,
          name: row.category_name,
          secondary_categories: [],
          brands: [],
        });
      }
    }
  }

  // Handle secondary + brand attach
  for (const row of rows) {
    const group = grouped[row.category_group_id];

    if (row.category_type === "secondary") {
      let parent = group.primary_categories.find(
        (p: any) => p.id === row.parent_category_id,
      );

      if (!parent) {
        parent = {
          id: row.parent_category_id,
          name: row.parent_category_name,
          secondary_categories: [],
          brands: [],
        };
        group.primary_categories.push(parent);
      }

      let secondary = parent.secondary_categories.find(
        (s: any) => s.id === row.category_id,
      );

      if (!secondary) {
        secondary = {
          id: row.category_id,
          name: row.category_name,
          brands: [],
        };
        parent.secondary_categories.push(secondary);
      }

      if (row.brand_id) {
        secondary.brands.push({
          id: row.brand_id,
          name: row.brand_name,
        });
      }
    }

    // If primary category has brands directly
    if (row.category_type === "primary" && row.brand_id) {
      const primary = group.primary_categories.find(
        (p: any) => p.id === row.category_id,
      );

      primary.brands.push({
        id: row.brand_id,
        name: row.brand_name,
      });
    }
  }

  return Object.values(grouped);
};

export const getBrandWithProducts = async (
  category_id: number,
  brand_id: number,
) => {
  const rows: any = await repo.getBrandProducts(category_id, brand_id);

  if (!rows || rows.length === 0) return null;

  const productsMap = new Map();

  rows.forEach((r: any) => {
    if (!productsMap.has(r.product_id)) {
      productsMap.set(r.product_id, {
        id: r.product_id,
        name: r.product_name,
        mrp: Number(r.mrp),
        description: r.description || null,

        // ✅ ADD THIS
        alternative_names: new Set(),

        // ✅ GST ARRAY
        gst: [],
      });
    }

    const product = productsMap.get(r.product_id);

    // ✅ HANDLE ALTERNATIVE NAMES
    if (r.alternative_name) {
      product.alternative_names.add(r.alternative_name);
    }

    // ✅ HANDLE GST (avoid duplicates)
    if (r.tax_id) {
      const exists = product.gst.some((g: any) => g.tax_id === r.tax_id);

      if (!exists) {
        product.gst.push({
          tax_id: r.tax_id,
          gst_variant_id: r.gst_variant_id,
          gst_value: r.gst_value,
          hsn_code: r.hsn_code,
          status: r.tax_status,
        });
      }
    }
  });

  // ✅ convert Set → Array
  const products = Array.from(productsMap.values()).map((p: any) => ({
    ...p,
    alternative_names: Array.from(p.alternative_names),
  }));

  return {
    brand_id: rows[0].brand_id,
    brand_name: rows[0].brand_name,
    products,
  };
};
