import pool from "../config/db";

export const softDeleteById = async (
  table: string,
  id: number
) => {
  await pool.query(
    `UPDATE ${table}
     SET is_active = 0
     WHERE id = ?`,
    [id]
  );
};
