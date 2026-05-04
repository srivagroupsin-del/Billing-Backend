import * as repo from "./apiKey.repo";
import { normalizeInput } from "../../utils/token.util";

const cache = new Map<string, any>();

// 🔑 CACHE HELPER
const getCacheKey = (service: string, platform: string) =>
  `${service}_${platform}`;

// ➕ CREATE / UPDATE
export const createOrUpdate = async (body: any) => {
  let { service_name, platform_type, api_key, expires_at } = body;

  if (!service_name || !platform_type || !api_key || !expires_at) {
    throw new Error("All fields are required");
  }

  const normalized = normalizeInput(service_name, platform_type);

  const existing = await repo.findByService(
    normalized.service_name,
    normalized.platform_type,
  );

  if (existing) {
    await repo.updateApiKey(
      normalized.service_name,
      normalized.platform_type,
      api_key,
      expires_at,
    );

    await repo.insertLog(
      normalized.service_name,
      normalized.platform_type,
      existing.access_token,
      api_key,
    );
  } else {
    await repo.insertApiKey(
      normalized.service_name,
      normalized.platform_type,
      api_key,
      expires_at,
    );
  }

  // 🔄 clear cache
  cache.delete(getCacheKey(normalized.service_name, normalized.platform_type));

  return {
    message: existing ? "Token updated" : "Token created",
    api_key,
    expires_at,
  };
};

// ✅ GET ACTIVE (WITH CACHE)
export const getActiveApiKey = async (
  service_name: string,
  platform_type: string,
) => {
  const normalized = normalizeInput(service_name, platform_type);
  const key = getCacheKey(normalized.service_name, normalized.platform_type);

  const BUFFER_TIME = 60 * 1000; // 1 minute

  const cached = cache.get(key);

  if (cached && cached.expires_at - Date.now() > BUFFER_TIME) {
    return { access_token: cached.token };
  }

  const data = await repo.getActiveKey(
    normalized.service_name,
    normalized.platform_type,
  );

  if (!data) throw new Error("No active token found");

  cache.set(key, {
    token: data.access_token,
    expires_at: new Date(data.expires_at).getTime(),
  });

  return data;
};

// OTHER FUNCTIONS SAME
export const getAll = repo.getAll;
export const getOne = repo.findByService;
export const getLogs = repo.getLogs;
