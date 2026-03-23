import productPool from "../../config/productDb";

export const getBusinessCategoryGroups = async (
  business_id: number
) => {
  const [rows] = await productPool.query(
    `SELECT 
        BCG.id,
        B.id AS business_id,
        B.name,
        BCG.category_group_id,
        CG.name AS category_group_name
      FROM srivagroupsin_business_db1.businesses B
      LEFT JOIN srivagroupsin_product_db_2.business_category_group BCG
          ON B.id = BCG.business_id
          AND BCG.is_active = 1
      LEFT JOIN srivagroupsin_product_db_2.category_group CG
          ON CG.id = BCG.category_group_id
      WHERE B.id = ?;`,
    [business_id]
  );

  return rows;
};
