import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import stringify from "fast-json-stable-stringify";

const ADMIN_SECRET = process.env.API_KEY_ADMIN_SECRET || "MY_SECRET_KEY";
const ALLOWED_IPS = ["127.0.0.1", "::1", "YOUR_EXTERNAL_SERVER_IP"];
export const verifyAdminAccess = (
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

    // if (!ALLOWED_IPS.includes(clientIp || "")) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "IP not allowed",
    //   });
    // }

    // 🔐 2. ADMIN SECRET
    const adminSecret = req.header("x-admin-secret");

    if (!adminSecret || adminSecret !== ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin secret",
      });
    }

    // 🔐 3. HMAC SIGNATURE
    const signature = req.header("x-signature");
    const timestamp = req.header("x-timestamp");

    if (!signature || !timestamp) {
      return res.status(400).json({
        success: false,
        message: "Missing signature headers",
      });
    }

    // ⏱️ Prevent replay attack (5 min window)
    const now = Date.now();
    const requestTime = parseInt(timestamp);

    if (Math.abs(now - requestTime) > 5 * 60 * 1000) {
      return res.status(403).json({
        success: false,
        message: "Request expired",
      });
    }

    // 🔑 Create expected signature
    const payload = stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", ADMIN_SECRET)
      .update(payload + timestamp)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(403).json({
        success: false,
        message: "Invalid signature",
      });
    }

    console.log("🔐 Admin Access Attempt:", {
      ip: clientIp,
      timestamp,
    });

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Security validation failed",
    });
  }
};
