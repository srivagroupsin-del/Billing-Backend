import { catchAsync } from "../../utils/catchAsync";
import { successResponse } from "../../utils/response";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";
import { Request, Response } from "express";
import * as service from "./apiKey.service";

// ➕ CREATE / UPDATE (optional admin)
export const createOrUpdateApiKey = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const result = await service.createOrUpdate(req.body);
      return successResponse({ res });
    } catch (err: any) {
      console.error(err);
      throw new BusinessError(
        err.message || "Internal Server Error",
        ErrorCodes.BUSINESS_RULE_VIOLATION,
      );
    }
  },
);

// 🔄 SYNC FROM CENTRAL SERVICE
export const syncRegistry = catchAsync(async (_: Request, res: Response) => {
  try {
    await service.syncFromRegistry();
    return successResponse({ res, message: "Registry synced" });
  } catch (err: any) {
    throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
  }
});

// 📥 GET ALL
export const getAllApiKeys = catchAsync(async (_: Request, res: Response) => {
  try {
    const data = await service.getAll();
    return successResponse({ res, data: data });
  } catch {
    throw new BusinessError(
      "Error fetching data",
      ErrorCodes.BUSINESS_RULE_VIOLATION,
    );
  }
});

// 🔍 GET ONE
export const getApiKeyByService = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const service_name = req.params.service_name as string;
      const platform_type = req.params.platform_type as string;

      //  validate first
      if (!service_name || !platform_type) {
        throw new BusinessError(
          "service_name and platform_type required",
          ErrorCodes.BUSINESS_RULE_VIOLATION,
        );
      }

      //  normalize
      const data = await service.getOne(
        service_name.toLowerCase(),
        platform_type.toUpperCase(),
      );

      if (!data) {
        throw new BusinessError(
          "Not found",
          ErrorCodes.BUSINESS_RULE_VIOLATION,
        );
      }

      return successResponse({ res, data: data });
    } catch {
      throw new BusinessError(
        "Error fetching data",
        ErrorCodes.BUSINESS_RULE_VIOLATION,
      );
    }
  },
);

// 📜 LOGS
export const getApiKeyLogs = catchAsync(async (_: Request, res: Response) => {
  try {
    const data = await service.getLogs();
    return successResponse({ res, data: data });
  } catch {
    throw new BusinessError(
      "Error fetching logs",
      ErrorCodes.BUSINESS_RULE_VIOLATION,
    );
  }
});

//  PUBLIC API
export const getPublicApiKey = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const service_name = req.query.service_name as string;
      const platform_type = req.query.platform_type as string;

      //  validation
      if (!service_name || !platform_type) {
        throw new BusinessError(
          "service_name and platform_type required",
          ErrorCodes.BUSINESS_RULE_VIOLATION,
        );
      }

      const data = await service.getActiveApiKey(service_name, platform_type);

      return successResponse({ res });
    } catch (err: any) {
      throw new BusinessError(
        err.message || "API key not found",
        ErrorCodes.BUSINESS_RULE_VIOLATION,
      );
    }
  },
);
