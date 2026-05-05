import express from "express";
import {
  createOrUpdateApiKey,
  getAllApiKeys,
  getApiKeyByService,
  getApiKeyLogs,
  getPublicApiKey,
  syncRegistry,
} from "./apiKey.controller";
import { verifyAdminAccess } from "../../middlewares/adminAuth.middleware";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = express.Router();

router.get("/public/api-key", getPublicApiKey);

// optional admin
router.post("/generate", verifyAdminAccess, createOrUpdateApiKey);

// 🔥 MAIN SYNC
router.post("/sync-registry", verifyAdminAccess, syncRegistry);

router.get("/logs", verifyAdminAccess, getApiKeyLogs);

router.get("/", authMiddleware, getAllApiKeys);
router.get("/:service_name/:platform_type", getApiKeyByService);

export default router;
