import apiDb from "../../config/api_key_validation";

// 🔍 FIND
export const findByService = async (
  service_name: string,
  platform_type: string,
) => {
  const [rows]: any = await apiDb.query(
    `SELECT * FROM api_keys 
     WHERE service_name=? 
     AND platform_type=?`,
    [service_name, platform_type],
  );

  return rows[0];
};

// ➕ INSERT
export const insertApiKey = async (
  service_name: string,
  platform_type: string,
  access_token: string,
  expires_at: string,
) => {
  await apiDb.query(
    `INSERT INTO api_keys 
     (service_name, platform_type, access_token, expires_at, is_active)
     VALUES (?, ?, ?, ?, 1)`,
    [service_name, platform_type, access_token, expires_at],
  );
};

// 🔄 UPDATE
export const updateApiKey = async (
  service_name: string,
  platform_type: string,
  access_token: string,
  expires_at: string,
) => {
  await apiDb.query(
    `UPDATE api_keys 
     SET access_token=?, expires_at=?, is_active=1, updated_at=NOW()
     WHERE service_name=? 
     AND platform_type=?`,
    [access_token, expires_at, service_name, platform_type],
  );
};

// 📝 LOG
export const insertLog = async (
  service_name: string,
  platform_type: string,
  oldToken: string,
  newToken: string,
) => {
  await apiDb.query(
    `INSERT INTO api_key_logs 
     (service_name, platform_type, old_api_key, new_api_key, changed_by)
     VALUES (?, ?, ?, ?, ?)`,
    [service_name, platform_type, oldToken, newToken, "ADMIN"],
  );
};

// 📥 GET ALL
export const getAll = async () => {
  const [rows]: any = await apiDb.query(
    `SELECT * FROM api_keys ORDER BY id DESC`,
  );
  return rows;
};

// 📜 GET LOGS
export const getLogs = async () => {
  const [rows]: any = await apiDb.query(
    `SELECT * FROM api_key_logs ORDER BY id DESC`,
  );
  return rows;
};

// ✅ GET ACTIVE TOKEN
export const getActiveKey = async (
  service_name: string,
  platform_type: string,
) => {
  const [rows]: any = await apiDb.query(
    `SELECT access_token, expires_at 
     FROM api_keys 
     WHERE service_name = ?
       AND platform_type = ?
       AND is_active = 1
       AND expires_at > UTC_TIMESTAMP()
     LIMIT 1`,
    [service_name, platform_type],
  );

  return rows[0];
};

export const upsertApiKey = async (
  service_name: string,
  platform_type: string,
  access_token: string,
  expires_at: string,
) => {
  await apiDb.query(
    `INSERT INTO api_keys 
     (service_name, platform_type, access_token, expires_at, is_active)
     VALUES (?, ?, ?, ?, 1)
     ON DUPLICATE KEY UPDATE 
       access_token = VALUES(access_token),
       expires_at = VALUES(expires_at),
       is_active = 1,
       updated_at = NOW()`,
    [service_name, platform_type, access_token, expires_at],
  );
};
