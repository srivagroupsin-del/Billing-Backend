import axios from "axios";
import apiDb from "../config/api_key_validation";

const API_KEY_CACHE: Record<string, string> = {};

// 🔥 GET ACTIVE API KEY FROM DB
const getApiKey = async (serviceName: string, platform: string) => {
  const cacheKey = `${serviceName}_${platform}`;

  if (API_KEY_CACHE[cacheKey]) {
    return API_KEY_CACHE[cacheKey];
  }

  const [rows]: any = await apiDb.query(
    `SELECT api_key FROM api_keys 
     WHERE service_name=? 
     AND platform_type=? 
     AND is_active=1 
     AND expires_at > NOW()
     LIMIT 1`,
    [serviceName, platform],
  );

  if (!rows || rows.length === 0) {
    throw new Error(`No active API key for ${serviceName}`);
  }

  API_KEY_CACHE[cacheKey] = rows[0].api_key;

  return rows[0].api_key;
};

// 🔥 AXIOS INSTANCE
const httpClient = axios.create({
  timeout: 10000,
});

// 🔥 REQUEST INTERCEPTOR
httpClient.interceptors.request.use(async (config) => {
  const serviceName = (config.headers["x-service-name"] as string) || "DEFAULT";

  const platform = "WEB"; // or dynamic later

  const apiKey = await getApiKey(serviceName, platform);

  config.headers["x-api-key"] = apiKey;
  config.headers["x-service-name"] = serviceName;
  config.headers["x-platform"] = platform;
  config.headers["Accept"] = "application/json";

  return config;
});

export default httpClient;
