import pool from "../../config/db";
import businessPool from "../../config/db";

export const getAllBusinesses = async () => {
  const [rows] = await businessPool.query(
    `SELECT id, name, createdat
     FROM businesses
     WHERE is_active = 1`,
  );

  return rows;
};

export const getBusinessById = async (id: number) => {
  const [rows]: any = await businessPool.query(
    `SELECT id, name, createdat
     FROM businesses
     WHERE id = ?
       AND is_active = 1`,
    [id],
  );

  return rows[0] || null;
};

export const getBusinessesByUserId = async (userId: number) => {
  const [rows]: any = await businessPool.query(
    `
    SELECT 
      b.id            AS business_id,
      b.name,
      b.created_at     AS business_created_at,
      u.id            AS user_id
    FROM businesses b
    INNER JOIN users u
      ON u.id = b.user_id
    WHERE b.user_id = ?
      AND b.is_active = 1
      AND u.is_active = 1
    ORDER BY b.created_at DESC
    `,
    [userId],
  );

  return rows; // ✅ LIST
};

export const getAllOperationTypes = async () => {
  const [rows]: any = await businessPool.query(
    `
    SELECT id, name, code, description
    FROM business_operation_types
    WHERE is_active = 1
    ORDER BY name ASC
    `,
  );

  return rows;
};

export const enableStorageTypes = async (
  businessId: number,
  storageTypeIds: number[],
) => {
  // First clear existing
  await businessPool.query(
    `DELETE FROM business_storage_type_mapping WHERE business_id = ?`,
    [businessId],
  );

  if (storageTypeIds.length === 0) return;

  // Then insert new
  const values = storageTypeIds.map((id) => [businessId, id]);
  await businessPool.query(
    `INSERT INTO business_storage_type_mapping (business_id, storage_type_id) VALUES ?`,
    [values],
  );
};

export const getBusinessStorageTypes = async (businessId: number) => {
  const [rows]: any = await businessPool.query(
    `
    SELECT storage_type_id
    FROM business_storage_type_mapping
    WHERE business_id = ?
    `,
    [businessId],
  );

  return rows.map((r: any) => r.storage_type_id);
};
