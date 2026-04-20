import { Request, Response, NextFunction } from "express";
import apiDb from "../config/api_key_validation";

export const verifyApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const apiKey = req.header("x-api-key");
    const serviceName = req.header("x-service-name");
    const platform = req.header("x-platform");

    // 🔴 Missing headers
    if (!apiKey || !serviceName || !platform) {
      return res.status(400).json({
        success: false,
        message: "API authentication headers are missing",
      });
    }

    // 🔍 Validate API key
    const [rows]: any = await apiDb.query(
      `SELECT id FROM api_keys 
       WHERE api_key=? 
       AND service_name=? 
       AND platform_type=? 
       AND is_active=1
       AND expires_at > NOW()`,
      [apiKey, serviceName, platform],
    );

    // 🔴 Invalid / expired key
    if (!rows || rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired API key",
      });
    }

    const keyId = rows[0].id;

    // 🔄 Update last usage (non-blocking best practice)
    apiDb
      .query("UPDATE api_keys SET last_used_at=NOW() WHERE id=?", [keyId])
      .catch(() => {
        // silently ignore logging errors
      });

    next();
  } catch (err) {
    // ❗ Log only in backend
    console.error("API KEY MIDDLEWARE ERROR:", err);

    // 🔒 Safe response (no internal details)
    return res.status(500).json({
      success: false,
      message: "Unable to validate API key",
    });
  }
};
