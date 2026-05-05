import { Request, Response, NextFunction } from "express";
import apiDb from "../config/api_key_validation";
import { getPrefix } from "../utils/token.util";

export const verifyApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const apiKey = req.header("x-api-key");
    const serviceName = (req.header("x-service-name") || "").toLowerCase();
    const platform = (req.header("x-platform") || "").toUpperCase();

    // ✅ header validation
    if (!apiKey || !serviceName || !platform) {
      return res.status(400).json({
        success: false,
        message: "Missing x-api-key / x-service-name / x-platform headers",
      });
    }

    // ✅ platform validation
    const allowedPlatforms = ["WEB", "MOBILE", "DESKTOP"];
    if (!allowedPlatforms.includes(platform)) {
      return res.status(400).json({
        success: false,
        message: "Invalid platform",
      });
    }

    // ✅ prefix validation
    const expectedPrefix = getPrefix(platform);
    if (!apiKey.startsWith(expectedPrefix)) {
      return res.status(403).json({
        success: false,
        message: "Token does not match platform",
      });
    }

    // ✅ DB validation
    const [rows]: any = await apiDb.query(
      `SELECT id FROM api_keys 
       WHERE access_token=? 
       AND service_name=? 
       AND platform_type=? 
       AND is_active=1
       AND expires_at > UTC_TIMESTAMP()
       LIMIT 1`,
      [apiKey, serviceName, platform],
    );

    if (!rows.length) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired API key",
      });
    }

    // ✅ attach caller info
    (req as any).apiClient = {
      service: serviceName,
      platform,
    };

    // 🔄 async update
    apiDb
      .query("UPDATE api_keys SET last_used_at=NOW() WHERE id=?", [rows[0].id])
      .catch(() => {});

    next();
  } catch (err) {
    console.error("API KEY VALIDATION ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Validation failed",
    });
  }
};
