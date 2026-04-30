import { Request, Response } from "express";
import * as service from "./apiKey.service";

// ➕ CREATE / UPDATE
export const createOrUpdateApiKey = async (req: Request, res: Response) => {
  try {
    const result = await service.createOrUpdate(req.body);
    return res.json({ success: true, ...result });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

// 📥 GET ALL
export const getAllApiKeys = async (_: Request, res: Response) => {
  try {
    const data = await service.getAll();
    return res.json({ success: true, data });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Error fetching data" });
  }
};

// 🔍 GET ONE
export const getApiKeyByService = async (req: Request, res: Response) => {
  try {
    const service_name = req.params.service_name as string;
    const platform_type = req.params.platform_type as string;

    if (!service_name || !platform_type) {
      return res.status(400).json({
        success: false,
        message: "service_name and platform_type required",
      });
    }

    const data = await service.getOne(service_name, platform_type);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching data",
    });
  }
};

// 📜 LOGS
export const getApiKeyLogs = async (_: Request, res: Response) => {
  try {
    const data = await service.getLogs();
    return res.json({ success: true, data });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Error fetching logs" });
  }
};

// ✅ PUBLIC API
export const getPublicApiKey = async (req: Request, res: Response) => {
  try {
    const service_name = req.query.service_name as string;
    const platform_type = req.query.platform_type as string;

    const data = await service.getActiveApiKey(service_name, platform_type);

    return res.json({
      success: true,
      api_key: data.access_token, // 👈 IMPORTANT CHANGE
    });
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      message: err.message || "API key not found",
    });
  }
};
