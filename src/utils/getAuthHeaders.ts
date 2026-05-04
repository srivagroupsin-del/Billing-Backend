// getAuthHeaders.ts

import { BASE_URLS } from "../config/apiUrls";

export const getAuthHeadersAuth = async () => {
  const res = await fetch(`${BASE_URLS.AUTH}api-key/active/Login/WEB`, {
    headers: {
      Accept: "application/json",
    },
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error("Failed to load API key");
  }

  // ✅ Correct path
  const API_KEY = data.data.access_token;

  return {
    "Content-Type": "application/json",
    Accept: "application/json",

    "x-api-key": API_KEY,
    "x-service-name": "Login",
    "x-platform": "WEB",
  };
};
