import pool from "../config/db";

export type Status = "active" | "inactive" | "blocked";

/**
 * Global status updater (safe + reusable)
 */
export const updateStatusById = async (
  table: string,
  id: number,
  status: Status
) => {
  // ⚠️ whitelist allowed tables (VERY IMPORTANT)
  const allowedTables = [
    "menu_title",
    "menu_fields",
    "menu_page",
    "sector_title",
    "sector",
    "sub_sector",
    "users",
  ];

  if (!allowedTables.includes(table)) {
    throw new Error("Invalid table name");
  }

  await pool.query(
    `UPDATE ${table}
     SET status = ?
     WHERE id = ?`,
    [status, id]
  );
};

// Sample
// updateStatusById("sector", id, status);
// router.patch("/titles/:id/status", ctrl.updateMenuTitleStatus);
