// ================= CONTROLLER =================

import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { BusinessError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { ErrorCodes } from "../../utils/errorCodes";
import { successResponse } from "../../utils/response";
import { getUserAppData, userAppData } from "./app_validation_service";

export const userAppDataController = catchAsync(
  async (req: AuthRequest, res: Response) => {
    try {
      // ✅ POST body data from frontend
      const data = req.body;

      const responseData = await userAppData(data);

      return successResponse({
        res,
        data: responseData,
      });
    } catch (err: any) {
      throw new BusinessError(
        err.message || "Something went wrong",
        ErrorCodes.BUSINESS_RULE_VIOLATION,
      );
    }
  },
);

export const getUserAppDataController = catchAsync(
  async (req: Request, res: Response) => {
    const data = await getUserAppData();

    return successResponse({
      res,
      data,
    });
  },
);
