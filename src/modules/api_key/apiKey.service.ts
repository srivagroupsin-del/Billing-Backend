import * as repo from "./apiKey.repo";

// ➕ CREATE / UPDATE
export const createOrUpdate = async (body: any) => {
  const { service_name, platform_type, api_key, expires_at } = body;

  if (!service_name || !platform_type || !api_key || !expires_at) {
    throw new Error("All fields are required");
  }

  const existing = await repo.findByService(service_name, platform_type);

  if (existing) {
    await repo.updateApiKey(service_name, platform_type, api_key, expires_at);

    await repo.insertLog(
      service_name,
      platform_type,
      existing.access_token,
      api_key,
    );

    return {
      message: "Token updated",
      api_key,
      expires_at,
    };
  } else {
    await repo.insertApiKey(service_name, platform_type, api_key, expires_at);

    return {
      message: "Token created",
      api_key,
      expires_at,
    };
  }
};

// 📥 GET ALL
export const getAll = async () => {
  return await repo.getAll();
};

// 🔍 GET ONE
export const getOne = async (service_name: string, platform_type: string) => {
  return await repo.findByService(service_name, platform_type);
};

// 📜 LOGS
export const getLogs = async () => {
  return await repo.getLogs();
};

// ✅ GET ACTIVE
export const getActiveApiKey = async (
  service_name: string,
  platform_type: string,
) => {
  const keyData = await repo.getActiveKey(service_name, platform_type);

  if (!keyData) {
    throw new Error("No active token found");
  }

  return keyData;
};
