import pool from "../../config/db";
import { CreateAuditInput } from "./audit.types";

/* INSERT AUDIT */
export const insertAudit = async (data: CreateAuditInput) => {
  await pool.query(
    `INSERT INTO audit_logs
     (user_id, module, record_id, action, old_data, new_data)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.user_id,
      data.module,
      data.record_id,
      data.action,
      data.old_data ? JSON.stringify(data.old_data) : null,
      data.new_data ? JSON.stringify(data.new_data) : null,
    ]
  );
};

/* COUNT ACTIONS PER RECORD */
export const getActionCounts = async (
  module: string,
  recordId: number
) => {
  const [[row]]: any = await pool.query(
    `
    SELECT
      SUM(action = 'create') AS create_count,
      SUM(action = 'update') AS update_count,
      SUM(action = 'delete') AS delete_count
    FROM audit_logs
    WHERE module = ?
      AND record_id = ?
    `,
    [module, recordId]
  );

  return row;
};

/* FULL HISTORY */
export const getHistory = async (
  module: string,
  recordId: number
) => {
  const [rows] = await pool.query(
    `
    SELECT
      action,
      user_id,
      old_data,
      new_data,
      created_at
    FROM audit_logs
    WHERE module = ?
      AND record_id = ?
    ORDER BY created_at DESC
    `,
    [module, recordId]
  );

  return rows;
};
