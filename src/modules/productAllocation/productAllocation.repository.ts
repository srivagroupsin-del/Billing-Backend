import pool from "../../config/db";

export class ProductAllocationRepository {
  /* ===============================
     ALLOCATE PRODUCTS
  =============================== */
  async allocateProducts(businessId: number, data: any) {
    const { setup_id, category_group_id, category_id, brand_id, products } =
      data;

    const values = products.map((p: any) => [
      businessId,
      setup_id,
      category_group_id ?? null,
      category_id ?? null,
      brand_id ?? null,
      p.product_id,
      p.min_sale_qty ?? 1,
      p.max_sale_qty ?? null,
    ]);

    const [result]: any = await pool.query(
      `INSERT INTO business_product_allocations
      (business_id, setup_id, category_group_id, category_id, brand_id, product_id, min_sale_qty, max_sale_qty)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        min_sale_qty = VALUES(min_sale_qty),
        max_sale_qty = VALUES(max_sale_qty)`,
      [values],
    );

    return result;
  }

  /* ===============================
     GET ALLOCATED PRODUCTS
  =============================== */
  async getAllocatedProducts(businessId: number) {
    const [rows]: any = await pool.execute(
      `
      SELECT 
    cg.id AS category_group_id,
    cg.name AS category_group_name,

    c.id AS category_id,
    c.category_name,
    c.category_type,
    c.parent_category_id,

    b.id AS brand_id,
    b.brand_name,

    p.id AS product_id,
    p.product_name,
    p.mrp,

    bpa.min_sale_qty,
    bpa.max_sale_qty,

    -- ✅ Alternative Names
    pan.alternative_name,

    -- ✅ GST
    pt.id AS tax_id,
    pt.gst_variant_id,
    vf.value AS gst_value,
    pt.hsn_code,
    pt.status AS tax_status

FROM business_product_allocations bpa

JOIN srivagroupsin_product_db_2.category_group cg 
    ON cg.id = bpa.category_group_id

JOIN srivagroupsin_product_db_2.category c 
    ON c.id = bpa.category_id

JOIN srivagroupsin_product_db_2.brand b 
    ON b.id = bpa.brand_id

JOIN srivagroupsin_product_db_2.product p 
    ON p.id = bpa.product_id

-- ✅ Alternative names
LEFT JOIN srivagroupsin_product_db_2.product_alternative_names pan
    ON pan.product_id = p.id

-- ✅ Tax
LEFT JOIN srivagroupsin_product_db_2.product_tax pt
    ON pt.product_id = p.id
    AND pt.is_active = 1
    AND pt.status = 'active'

LEFT JOIN srivagroupsin_product_db_2.variants_fields vf
    ON vf.id = pt.gst_variant_id
    AND vf.is_active = 1

WHERE bpa.business_id = ?
AND bpa.is_active = 1
      `,
      [businessId],
    );

    return rows;
  }

  /* ===============================
     UPDATE PRODUCT LIMITS
  =============================== */
  async updateAllocation(id: number, businessId: number, data: any) {
    const {
      category_group_id,
      category_id,
      brand_id,
      min_sale_qty,
      max_sale_qty,
    } = data;

    const [result]: any = await pool.execute(
      `UPDATE business_product_allocations
       SET category_group_id = ?,
           category_id = ?,
           brand_id = ?,
           min_sale_qty = ?,
           max_sale_qty = ?
       WHERE id = ? AND business_id = ?`,
      [
        category_group_id ?? null,
        category_id ?? null,
        brand_id ?? null,
        min_sale_qty ?? 1,
        max_sale_qty ?? null,
        id,
        businessId,
      ],
    );

    return result.affectedRows;
  }

  /* ===============================
     DELETE ALLOCATION
  =============================== */
  async deleteAllocation(id: number, businessId: number) {
    const [result]: any = await pool.execute(
      `UPDATE business_product_allocations
        SET is_active = 0
        WHERE product_id = ? AND business_id = ?`,
      [id, businessId],
    );

    return result.affectedRows;
  }
}
