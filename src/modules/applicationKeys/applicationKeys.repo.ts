import pool from "../../config/api_key_validation";

export const createOrUpdateAppKey = async (app_id: string, app_key: string) => {
  const [existing]: any = await pool.query(
    `SELECT id FROM application_keys WHERE app_id = ? AND is_deleted = 0 LIMIT 1`,
    [app_id]
  );

  if (existing && existing.length > 0) {
    await pool.query(
      `UPDATE application_keys SET app_key = ?, updated_at = CURRENT_TIMESTAMP WHERE app_id = ? AND is_deleted = 0`,
      [app_key, app_id]
    );
  } else {
    await pool.query(
      `INSERT INTO application_keys (app_id, app_key) VALUES (?, ?)`,
      [app_id, app_key]
    );
  }
};

export const getAppKeys = async (filters: { app_id?: string }) => {
  let query = `SELECT * FROM application_keys WHERE is_deleted = 0`;
  const params: any[] = [];

  if (filters.app_id) {
    query += ` AND app_id = ?`;
    params.push(filters.app_id);
  }

  query += ` ORDER BY id DESC`;

  const [rows] = await pool.query(query, params);
  return rows;
};
