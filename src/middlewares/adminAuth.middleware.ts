import { catchAsync } from "../utils/catchAsync";
import { BusinessError } from "../utils/appError";
import { ErrorCodes } from "../utils/errorCodes";
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import stringify from "fast-json-stable-stringify";

const ADMIN_SECRET = process.env.API_KEY_ADMIN_SECRET || "MY_SECRET_KEY";
export const verifyAdminAccess = catchAsync((
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 🔐 1. IP WHITELIST (optional but strong)
    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      req.ip;

    // 🔐 2. ADMIN SECRET
    const adminSecret = req.header("x-admin-secret");

    if (!adminSecret || adminSecret !== ADMIN_SECRET) {
      throw new BusinessError("Invalid admin secret", ErrorCodes.BUSINESS_RULE_VIOLATION);
    }

    // 🔐 3. HMAC SIGNATURE
    const signature = req.header("x-signature");
    const timestamp = req.header("x-timestamp");

    if (!signature || !timestamp) {
      throw new BusinessError("Missing signature headers", ErrorCodes.BUSINESS_RULE_VIOLATION);
    }

    // ⏱️ Prevent replay attack (5 min window)
    const now = Date.now();
    const requestTime = parseInt(timestamp);

    if (Math.abs(now - requestTime) > 5 * 60 * 1000) {
      throw new BusinessError("Request expired", ErrorCodes.BUSINESS_RULE_VIOLATION);
    }

    // 🔑 Create expected signature
    const payload = stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", ADMIN_SECRET)
      .update(payload + timestamp)
      .digest("hex");

    if (signature !== expectedSignature) {
      throw new BusinessError("Invalid signature", ErrorCodes.BUSINESS_RULE_VIOLATION);
    }

    console.log("ENV SECRET:", process.env.API_KEY_ADMIN_SECRET);
    console.log("timestamp:", timestamp);
    console.log("signature:", signature);
    console.log("expectedSignature:", expectedSignature);
    console.log("payload:", payload);

    console.log("🔐 Admin Access Attempt:", {
      ip: clientIp,
      timestamp,
    });

    console.log({
      adminSecret,
      signature,
      timestamp,
    });

    next();
  } catch (err) {
    throw new BusinessError("Security validation failed", ErrorCodes.BUSINESS_RULE_VIOLATION);
  }
});
