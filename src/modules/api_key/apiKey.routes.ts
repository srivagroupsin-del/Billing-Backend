import express from "express";
import {
  createOrUpdateApiKey,
  getAllApiKeys,
  getApiKeyByService,
  getApiKeyLogs,
  getPublicApiKey,
} from "./apiKey.controller";
import { verifyAdminAccess } from "../../middlewares/adminAuth.middleware";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = express.Router();

// 🔓 PUBLIC ROUTE (NO API KEY MIDDLEWARE)
router.get("/public/api-key", getPublicApiKey);

router.post("/generate", verifyAdminAccess, createOrUpdateApiKey);
router.get("/logs", verifyAdminAccess, getApiKeyLogs);

router.get("/", authMiddleware, getAllApiKeys);
router.get("/:service_name/:platform_type", getApiKeyByService);

export default router;
