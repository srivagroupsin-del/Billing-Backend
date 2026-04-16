import pool from "../../config/productDb";

export const getProducts = async () => {
  const [rows] = await pool.query(`
    SELECT
      p.id,
      p.product_name,

      GROUP_CONCAT(DISTINCT COALESCE(parent_c.category_name, c.category_name)
        ORDER BY COALESCE(parent_c.category_name, c.category_name)
        SEPARATOR ', ') AS primary_category,

      GROUP_CONCAT(DISTINCT CASE 
        WHEN parent_c.id IS NOT NULL THEN c.category_name 
      END ORDER BY c.category_name SEPARATOR ', ') AS secondary_category,

      p.mrp,
      p.model,
      p.series,
      p.description,
      p.info,
      p.note,
      p.system_note,
      p.base_image,
      p.status,

      GROUP_CONCAT(DISTINCT b.brand_name ORDER BY b.brand_name SEPARATOR ', ') AS brands,

      GROUP_CONCAT(
        DISTINCT CONCAT(c.category_name, ' (', b.brand_name, ')')
        ORDER BY c.category_name
        SEPARATOR ', '
      ) AS mappings,

      -- ✅ ADD THIS
      GROUP_CONCAT(DISTINCT pan.alternative_name SEPARATOR ', ') AS alternative_names

    FROM product p

    LEFT JOIN product_alternative_names pan
      ON pan.product_id = p.id

    LEFT JOIN product_category_brand pcb 
      ON pcb.product_id = p.id

    LEFT JOIN category_brand_mapping cb 
      ON cb.id = pcb.category_brand_id
      AND cb.is_active = 1

    LEFT JOIN brand b 
      ON b.id = cb.brand_id
      AND b.is_active = 1

    LEFT JOIN category c 
      ON c.id = cb.category_id
      AND c.is_active = 1

    LEFT JOIN category parent_c 
      ON c.parent_category_id = parent_c.id
      AND parent_c.is_active = 1

    WHERE p.is_active = 1

    GROUP BY p.id
  `);

  return rows;
};

export const getProductById = async (id: number) => {
  const [rows]: any = await pool.query(
    `
    SELECT
      p.id,
      p.product_name,
      p.model,
      p.series,
      p.mrp,
      p.description,
      p.info,
      p.note,
      p.system_note,
      p.base_image,
      p.status,

      pan.alternative_name,

      cb.id AS mapping_id,
      c.id AS category_id,
      c.category_name,
      c.category_type,
      pc.id AS primary_category_id,
      pc.category_name AS primary_category_name,
      b.id AS brand_id,
      b.brand_name

    FROM product p

    LEFT JOIN product_alternative_names pan
      ON pan.product_id = p.id

    LEFT JOIN product_category_brand pcb
      ON pcb.product_id = p.id

    LEFT JOIN category_brand_mapping cb
      ON cb.id = pcb.category_brand_id

    LEFT JOIN category c
      ON c.id = cb.category_id

    LEFT JOIN category pc
      ON pc.id = c.parent_category_id

    LEFT JOIN brand b
      ON b.id = cb.brand_id

    WHERE p.id = ?
      AND p.is_active = 1
    `,
    [id],
  );

  if (!rows.length) return null;

  return rows; // ✅ IMPORTANT (NOT rows[0])
};
