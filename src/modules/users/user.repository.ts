import pool from "../../config/db";
import { parseJSON } from "../../utils/json.helper";
import { User } from "./user.types";

const TABLE = "users";

/**
 * Get all users
 */
export const getAllUsers = async (): Promise<User[]> => {
  const [rows]: any = await pool.query(
    `SELECT 
      id,
      name,
      email,
      details,
      add_json,
      is_active,
      is_enabled,
      status,
      created_at,
      updated_at
     FROM ${TABLE}`
  );

  return rows.map((u: any) => ({
    ...u,
    details: parseJSON(u.details),
    add_json: parseJSON(u.add_json),
    is_active: Boolean(u.is_active),
    is_enabled: Boolean(u.is_enabled),
  }));
};

/**
 * Get user by ID
 */
export const getUserById = async (
  id: bigint | number
): Promise<User | null> => {
  const [rows]: any = await pool.query(
    `SELECT * FROM ${TABLE} WHERE id = ? LIMIT 1`,
    [id]
  );

  if (!rows.length) return null;

  const u = rows[0];

  return {
    ...u,
    details: parseJSON(u.details),
    add_json: parseJSON(u.add_json),
    is_active: Boolean(u.is_active),
    is_enabled: Boolean(u.is_enabled),
  };
};

/**
 * Get user by Email
 */
export const getUserByEmail = async (
  email: string
): Promise<User | null> => {
  const [rows]: any = await pool.query(
    `SELECT * FROM ${TABLE} WHERE email = ? LIMIT 1`,
    [email]
  );

  if (!rows.length) return null;

  const u = rows[0];

  return {
    ...u,
    details: parseJSON(u.details),
    add_json: parseJSON(u.add_json),
    is_active: Boolean(u.is_active),
    is_enabled: Boolean(u.is_enabled),
  };
};

/**
 * Get only active users
 */
export const getActiveUsers = async (): Promise<User[]> => {
  const [rows]: any = await pool.query(
    `SELECT 
      id,
      user_id,
      name,
      email,
      details,
      add_json,
      status,
      is_active,
      is_enabled,
      created_at,
      updated_at
     FROM ${TABLE}
     WHERE is_active = 1 AND status = 'active'`
  );

  return rows.map((u: any) => ({
    ...u,
    details: parseJSON(u.details),
    add_json: parseJSON(u.add_json),
    is_active: Boolean(u.is_active),
    is_enabled: Boolean(u.is_enabled),
  }));
};
