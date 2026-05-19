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

      let apiRowId: number | null = null;

      if (platform === "WEB" || apiKey.startsWith("W_")) {
        //  DB validation (Only for WEB)
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
        apiRowId = rows[0].id;
      }

      //  attach caller info
      (req as any).apiClient = {
        service: serviceName,
        platform,
      };

      // 📱 Mobile Specific Validation
      if (platform === "MOBILE" || apiKey.startsWith("M_")) {
        const appKey =
          req.header("x-app-key") || req.header("x-application-key");
        const userToken = req.header("x-user-token");

        if (!appKey || !userToken) {
          throw new BusinessError(
            "Missing x-app-key or x-user-token headers for MOBILE platform",
            ErrorCodes.BUSINESS_RULE_VIOLATION,
          );
        }

        // Validate App Key
        const [appKeyRows]: any = await apiDb.query(
          `SELECT id FROM application_keys WHERE app_key=? AND is_deleted=0 LIMIT 1`,
          [appKey],
        );

        if (!appKeyRows.length) {
          throw new BusinessError(
            "Invalid application key",
            ErrorCodes.BUSINESS_RULE_VIOLATION,
          );
        }

        // Validate User Token
        const [userTokenRows]: any = await apiDb.query(
          `SELECT id FROM user_tokens WHERE user_token=? AND is_deleted=0 LIMIT 1`,
          [userToken],
        );

        if (!userTokenRows.length) {
          throw new BusinessError(
            "Invalid user token",
            ErrorCodes.BUSINESS_RULE_VIOLATION,
          );
        }
      }

      // 🔄 async update
      if (apiRowId) {
        apiDb
          .query("UPDATE api_keys SET last_used_at=NOW() WHERE id=?", [
            apiRowId,
          ])
          .catch(() => {});
      }

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
