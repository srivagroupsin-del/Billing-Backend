import pool from "../config/db";

type Primitive = string | number;

export const ensureUnique = async (
  table: string,
  column: string,
  value: Primitive,
  excludeId?: number,
  extraWhere?: string,
  params: Primitive[] = []
): Promise<void> => {
  let sql = `SELECT id FROM ${table} WHERE ${column} = ?`;
  const values: Primitive[] = [value];

  if (extraWhere) {
    sql += ` AND ${extraWhere}`;
    values.push(...params);
  }

  if (excludeId !== undefined) {
    sql += ` AND id != ?`;
    values.push(excludeId);
  }

  const [rows]: any = await pool.query(sql, values);

  if (rows.length > 0) {
    throw new Error(`${column.replace(/_/g, " ")} already exists`);
  }
};

export const ensureUniqueActive = (
  table: string,
  column: string,
  value: Primitive,
  excludeId?: number
) =>
  ensureUnique(
    table,
    column,
    value,
    excludeId,
    "is_active = 1"
  );
