// utils/token.util.ts

export const getPrefix = (platform: string) => {
  switch (platform) {
    case "WEB":
      return "W_";
    case "MOBILE":
      return "M_";
    case "DESKTOP":
      return "D_";
    default:
      throw new Error("Invalid platform");
  }
};

export const normalizeInput = (service: string, platform: string) => {
  return {
    service_name: service.toLowerCase(),
    platform_type: platform.toUpperCase(),
  };
};
