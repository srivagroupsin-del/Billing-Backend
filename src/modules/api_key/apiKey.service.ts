import axios from "axios";
import * as repo from "./apiKey.repo";
import { normalizeInput } from "../../utils/token.util";
import { toMySQLDateTime } from "../../utils/date.util";

const cache = new Map<string, any>();

const getCacheKey = (service: string, platform: string) =>
  `${service}_${platform}`;

// =====================================================
// ➕ CREATE / UPDATE (MANUAL / ADMIN USE)
// =====================================================
export const createOrUpdate = async (body: any) => {
  let { service_name, platform_type, api_key, expires_at } = body;

  if (!service_name || !platform_type || !api_key || !expires_at) {
    throw new Error("All fields are required");
  }

  const normalized = normalizeInput(service_name, platform_type);

  // 🔍 existing (for log)
  const existing = await repo.findByService(
    normalized.service_name,
    normalized.platform_type,
  );

  // 🔥 UPSERT
  await repo.upsertApiKey(
    normalized.service_name,
    normalized.platform_type,
    api_key,
    expires_at,
  );

  // 📝 log
  if (existing) {
    await repo.insertLog(
      normalized.service_name,
      normalized.platform_type,
      existing.access_token,
      api_key,
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

const fetchTokensWithRetry = async (retries = 3) => {
  try {
    return await axios.get("https://apikeys.srivagroups.in/api/tokens", {
      timeout: 5000,
    });
  } catch (err) {
    if (retries > 0) {
      console.log(`🔁 Retry... (${retries})`);
      await new Promise((r) => setTimeout(r, 2000));
      return fetchTokensWithRetry(retries - 1);
    }
    throw err;
  }
};

// =====================================================
// 🔄 SYNC FROM CENTRAL TOKEN SERVICE
// =====================================================
export const syncFromRegistry = async () => {
  try {
    const { data } = await fetchTokensWithRetry();

    if (!data?.data || !Array.isArray(data.data)) {
      throw new Error("Invalid token registry response");
    }

    await Promise.all(
      data.data.map(async (t: any) => {
        const normalized = normalizeInput(t.app_name, t.app_type);

        await repo.upsertApiKey(
          normalized.service_name,
          normalized.platform_type,
          t.token,
          toMySQLDateTime(t.expires_at || new Date().toISOString()),
        );

        cache.delete(
          getCacheKey(normalized.service_name, normalized.platform_type),
        );
      }),
    );

    console.log("✅ Registry sync completed");
  } catch (err: any) {
    console.error(
      "❌ Registry sync failed:",
      err?.response?.status,
      err?.message,
    );
  }
};

// =====================================================
// 🔑 GET ACTIVE TOKEN (WITH CACHE)
// =====================================================
export const getActiveApiKey = async (
  service_name: string,
  platform_type: string,
) => {
  const normalized = normalizeInput(service_name, platform_type);
  const key = getCacheKey(normalized.service_name, normalized.platform_type);

  const BUFFER_TIME = 60 * 1000;

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

// =====================================================
// OTHER EXPORTS
// =====================================================
export const getAll = repo.getAll;
export const getOne = repo.findByService;
export const getLogs = repo.getLogs;
