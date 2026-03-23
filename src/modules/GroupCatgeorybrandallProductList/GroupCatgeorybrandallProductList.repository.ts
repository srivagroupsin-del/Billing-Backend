import productPool from "../../config/productDb";

export const getCategoryGroupMappings = async (
  category_group_id: number[]
) => {
  const [rows] = await productPool.query(
    `SELECT 
        CGM.category_group_id,
        CG.name AS category_group_name,
        C.id AS category_id,
        C.category_name,
        C.category_type,
        C.parent_category_id,
        P.category_name AS parent_category_name,
        CGM.created,
        CGM.updated

     FROM category_group_mapping CGM

     INNER JOIN category_group CG
        ON CG.id = CGM.category_group_id
        AND CG.is_active = 1
        AND CG.status = 'active'

     INNER JOIN category C
        ON C.id = CGM.category_id
        AND C.is_active = 1
        AND C.status = 'active'

     LEFT JOIN category P
        ON P.id = C.parent_category_id
        AND P.is_active = 1
        AND P.status = 'active'

     WHERE CGM.category_group_id IN (?)
       AND CGM.is_active = 1`,
    [category_group_id]
  );

  return rows;
};

export const getCategoryBrandMappings = async (
  category_group_ids: number[]
) => {
  const [rows] = await productPool.query(
    `
   SELECT 
   CGM.category_group_id,
   CG.name AS category_group_name,

   C.id AS category_id,
   C.category_name,
   C.category_type,
   C.parent_category_id,
   P.category_name AS parent_category_name,

   B.id AS brand_id,
   B.brand_name

   FROM category_group_mapping CGM

   INNER JOIN category_group CG
      ON CG.id = CGM.category_group_id
      AND CG.is_active = 1
      AND CG.status = 'active'

   INNER JOIN category C
      ON C.id = CGM.category_id
      AND C.is_active = 1
      AND C.status = 'active'

   LEFT JOIN category P
      ON P.id = C.parent_category_id
      AND P.is_active = 1
      AND P.status = 'active'

   INNER JOIN category_brand_mapping CBM
      ON CBM.category_id = C.id
      AND CBM.is_active = 1
      AND CBM.status = 'active'

   INNER JOIN brand B
      ON B.id = CBM.brand_id
      AND B.is_active = 1
      AND B.status = 'active'

   WHERE CGM.category_group_id IN (?)
   AND CGM.is_active = 1
    `,
    [category_group_ids]
  );

  return rows;
};

export const getBrandProducts = async (
  category_id: number,
  brand_id: number
) => {

  const [rows] = await productPool.query(
    `
    SELECT 
        B.id AS brand_id,
        B.brand_name,

        P.id AS product_id,
        P.product_name,
        P.mrp,
        P.description

     FROM product_category_brand PCB

     INNER JOIN product P
        ON P.id = PCB.product_id
        AND P.is_active = 1
        AND P.status = 'active'

     INNER JOIN category_brand_mapping CBM
        ON CBM.id = PCB.category_brand_id
        AND CBM.is_active = 1
        AND CBM.status = 'active'

     INNER JOIN category C
        ON C.id = CBM.category_id
        AND C.is_active = 1
        AND C.status = 'active'

     INNER JOIN brand B
        ON B.id = CBM.brand_id
        AND B.is_active = 1
        AND B.status = 'active'

     WHERE B.id = ?
       AND C.id = ?
       AND PCB.is_active = 1
       AND PCB.status = 'active'
    `,
    [brand_id, category_id]
  );

  return rows;
};