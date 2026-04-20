import express from "express";
import {
  createOrUpdateApiKey,
  getAllApiKeys,
  getApiKeyByService,
  getApiKeyLogs,
} from "./apiKey.controller";

const router = express.Router();

router.post("/generate", createOrUpdateApiKey);
router.get("/logs", getApiKeyLogs);

router.get("/", getAllApiKeys);
router.get("/:service_name/:platform_type", getApiKeyByService);

export default router;
