import pool from "../../config/db";

/**
 * Find user by email
 */
export const findUserByEmail = async (email: string) => {
  const [rows]: any = await pool.query(
    `SELECT
       *
     FROM users
     WHERE email = ? AND is_active = 1
     LIMIT 1;
    `,
    [email],
  );

  if (!rows.length) return null;

  const user = rows[0];
  return user;
};

/**
 * Create new user
 */
export const createUser = async (data: {
  user_id: string;
  name: string;
  email: string;
  password: string;
}) => {
  const [result]: any = await pool.query(
    `INSERT INTO users (user_id, name, email, password, status, is_active)
     VALUES (?, ?, ?, ?, 'active', 1)`,
    [data.user_id, data.name, data.email, data.password],
  );

  return result.insertId;
};

export const updateUserMainId = async (userId: number, userMainId: string) => {
  await pool.query(`UPDATE users SET user_id = ? WHERE id = ?`, [
    userMainId,
    userId,
  ]);
};

export const validateUserBusiness = async (
  userId: number,
  businessId: number,
) => {
  const [rows]: any = await pool.query(
    `
    SELECT id
    FROM businesses
    WHERE id = ?
      AND user_id = ?
      AND is_active = 1
    `,
    [businessId, userId],
  );

  return rows.length > 0;
};

export const updateCentralToken = async (
  userId: number,
  token: string,
  expiry: string,
) => {
  await pool.query(
    `
    UPDATE users
    SET central_token = ?, central_token_expiry = ?
    WHERE id = ?
    `,
    [token, expiry, userId],
  );
};

export const getUserById = async (id: number) => {
  const [rows]: any = await pool.query(
    `SELECT * FROM users WHERE id = ? LIMIT 1`,
    [id],
  );

  return rows[0] || null;
};
