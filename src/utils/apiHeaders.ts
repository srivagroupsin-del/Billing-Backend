import axios from "axios";

export const getHeaders = async (service: string, platform: string = "WEB") => {
  const response = await axios.get(
    "https://external-system.com/api/get-api-key",
    {
      params: {
        service_name: service,
        platform_type: platform,
      },
    },
  );

  const apiKey = response.data?.api_key;

  if (!apiKey) {
    throw new Error("API key not received");
  }

  return {
    "x-api-key": apiKey,
    "x-service-name": service,
    "x-platform": platform,
    Accept: "application/json",
  };
};
