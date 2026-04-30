import { Request, Response, NextFunction } from "express";
import apiDb from "../config/api_key_validation";

export const verifyApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const apiKey = req.header("x-api-key");
    const serviceName = (req.header("x-service-name") || "").toUpperCase();
    const platform = (req.header("x-platform") || "").toUpperCase();

    // ✅ 1. check missing FIRST
    if (!apiKey || !serviceName || !platform) {
      return res.status(400).json({
        success: false,
        message: "API authentication headers are missing",
      });
    }

    // ✅ 2. validate platform
    const allowedPlatforms = ["WEB", "MOBILE", "DESKTOP"];

    if (!allowedPlatforms.includes(platform)) {
      return res.status(400).json({
        success: false,
        message: "Invalid platform",
      });
    }

    // 🔥 OPTIONAL (extra security)
    if (
      (platform === "WEB" && !apiKey.startsWith("W_")) ||
      (platform === "MOBILE" && !apiKey.startsWith("M_")) ||
      (platform === "DESKTOP" && !apiKey.startsWith("D_"))
    ) {
      return res.status(403).json({
        success: false,
        message: "Token does not match platform",
      });
    }

    // ✅ 4. DB validation
    const [rows]: any = await apiDb.query(
      `SELECT id FROM api_keys 
       WHERE access_token=? 
       AND service_name=? 
       AND platform_type=? 
       AND is_active=1
       AND expires_at > NOW()`,
      [apiKey, serviceName, platform],
    );

    if (!rows || rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired API key",
      });
    }

    const keyId = rows[0].id;

    // 🔄 async update (non-blocking)
    apiDb
      .query("UPDATE api_keys SET last_used_at=NOW() WHERE id=?", [keyId])
      .catch(() => {});

    next();
  } catch (err) {
    console.error("API KEY MIDDLEWARE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to validate API key",
    });
  }
};
