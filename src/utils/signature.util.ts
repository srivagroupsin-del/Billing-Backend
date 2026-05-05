import crypto from "crypto";
import stringify from "fast-json-stable-stringify";

export const generateSignature = (payload: any, timestamp: string) => {
  return crypto
    .createHmac("sha256", process.env.API_KEY_ADMIN_SECRET!)
    .update(stringify(payload) + timestamp) // 🔥 FIXED
    .digest("hex");
};
