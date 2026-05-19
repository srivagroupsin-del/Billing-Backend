import { getActiveApiKey } from "../modules/api_key/apiKey.service";

export const getAuthHeaders = async () => {
  // 🔥 Get token from local DB (already synced)
  const data = await getActiveApiKey("billing", "WEB");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",

    "x-api-key": data.access_token, //  login token
    "x-service-name": "billing", //  caller
    "x-platform": "WEB",
  };
};

export const getProductHeaders = async () => {
  const data = await getActiveApiKey("billing", "WEB");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",

    "x-api-key": data.access_token,

    "x-service-name": "billing",

    "x-platform": "WEB",
  };
};

export const getAuthHeadersMobile = async (
  appId?: string,
  appToken?: string,
  userId?: string,
  userToken?: string
) => {
  // 🔥 Get token from local DB for MOBILE
  const data = await getActiveApiKey("billing", "MOBILE");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",

    "x-api-key": data?.access_token || "",
    "x-service-name": "billing",
    "x-platform": "MOBILE",

    // ✅ Added new Mobile Headers
    "x-application-id": appId || "",
    "x-application-token": appToken || "",
    "x-user-id": userId || "",
    "x-user-token": userToken || "",
  };
};

export const getProductHeadersMobile = async (
  appId?: string,
  appToken?: string,
  userId?: string,
  userToken?: string
) => {
  const data = await getActiveApiKey("billing", "MOBILE");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",

    "x-api-key": data?.access_token || "",
    "x-service-name": "billing",
    "x-platform": "MOBILE",

    // ✅ Added new Mobile Headers
    "x-application-id": appId || "",
    "x-application-token": appToken || "",
    "x-user-id": userId || "",
    "x-user-token": userToken || "",
  };
};
