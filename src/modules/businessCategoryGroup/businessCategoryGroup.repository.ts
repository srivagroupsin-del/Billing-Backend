import productPool from "../../config/productDb";

export const getBusinessCategoryGroups = async (business_id: number) => {
  const [rows]: any = await productPool.query(
    `
    SELECT 
      BCG.id,
      BCG.business_id,
      BCG.category_group_id,
      CG.name AS category_group_name,
      BCG.created
    FROM srivagroupsin_product_db_2.business_category_group BCG
    INNER JOIN srivagroupsin_product_db_2.category_group CG
      ON CG.id = BCG.category_group_id
      AND CG.is_active = 1
    WHERE BCG.business_id = ?
      AND BCG.is_active = 1
    `,
    [business_id],
  );

  return rows;
};
