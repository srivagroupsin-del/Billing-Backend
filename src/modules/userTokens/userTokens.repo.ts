import pool from "../../config/api_key_validation";

export const createOrUpdateToken = async (user_id: string, user_token: string) => {
  const [existing]: any = await pool.query(
    `SELECT id FROM user_tokens WHERE user_id = ? AND is_deleted = 0 LIMIT 1`,
    [user_id]
  );

  if (existing && existing.length > 0) {
    await pool.query(
      `UPDATE user_tokens SET user_token = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND is_deleted = 0`,
      [user_token, user_id]
    );
  } else {
    await pool.query(
      `INSERT INTO user_tokens (user_id, user_token) VALUES (?, ?)`,
      [user_id, user_token]
    );
  }
};

export const getTokens = async (filters: { user_id?: string }) => {
  let query = `SELECT * FROM user_tokens WHERE is_deleted = 0`;
  const params: any[] = [];

  if (filters.user_id) {
    query += ` AND user_id = ?`;
    params.push(filters.user_id);
  }

  query += ` ORDER BY id DESC`;

  const [rows] = await pool.query(query, params);
  return rows;
};
