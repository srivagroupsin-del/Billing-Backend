import { catchAsync } from "../utils/catchAsync";
import { BusinessError } from "../utils/appError";
import { ErrorCodes } from "../utils/errorCodes";
import { Request, Response, NextFunction } from "express";
import apiDb from "../config/api_key_validation";
import { getPrefix } from "../utils/token.util";

export const verifyApiKey = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const apiKey = req.header("x-api-key");
      const serviceName = (req.header("x-service-name") || "").toLowerCase();
      const platform = (req.header("x-platform") || "").toUpperCase();

      //  header validation
      if (!apiKey || !serviceName || !platform) {
        throw new BusinessError(
          "Missing x-api-key / x-service-name / x-platform headers",
          ErrorCodes.BUSINESS_RULE_VIOLATION,
        );
      }

      //  platform validation
      const allowedPlatforms = ["WEB", "MOBILE", "DESKTOP"];
      if (!allowedPlatforms.includes(platform)) {
        throw new BusinessError(
          "Invalid platform",
          ErrorCodes.BUSINESS_RULE_VIOLATION,
        );
      }

      //  prefix validation
      const expectedPrefix = getPrefix(platform);
      if (!apiKey.startsWith(expectedPrefix)) {
        throw new BusinessError(
          "Token does not match platform",
          ErrorCodes.BUSINESS_RULE_VIOLATION,
        );
      }

      //  DB validation
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
        throw new BusinessError(
          "Invalid or expired API key",
          ErrorCodes.BUSINESS_RULE_VIOLATION,
        );
      }

      //  attach caller info
      (req as any).apiClient = {
        service: serviceName,
        platform,
      };

      // 🔄 async update
      apiDb
        .query("UPDATE api_keys SET last_used_at=NOW() WHERE id=?", [
          rows[0].id,
        ])
        .catch(() => {});

      next();
    } catch (err) {
      console.error("API KEY VALIDATION ERROR:", err);
      throw new BusinessError(
        "Validation failed",
        ErrorCodes.BUSINESS_RULE_VIOLATION,
      );
    }
  },
);
