import { getActiveApiKey } from "../modules/api_key/apiKey.service";

export const getAuthHeaders = async () => {
  // 🔥 Get token from local DB (already synced)
  const data = await getActiveApiKey("login", "WEB");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",

    "x-api-key": data.access_token, // ✅ login token
    "x-service-name": "billing", // ✅ caller
    "x-platform": "WEB",
  };
};

export const getProductHeaders = async () => {
  // 🔥 Get token from local DB (already synced)
  const data = await getActiveApiKey("login", "WEB");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",

    "x-api-key": data.access_token, // ✅ login token
    "x-service-name": "billing", // ✅ caller
    "x-platform": "WEB",
  };
};
