import { catchAsync } from "../../utils/catchAsync";
import { successResponse } from "../../utils/response";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import * as service from "./businessCategoryGroup.service";

export const getBusinessCategoryGroups = catchAsync(
  async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const userId = req.user?.id; //  ADD THIS

      if (!businessId) {
        throw new BusinessError(
          "Please select a business",
          ErrorCodes.BUSINESS_RULE_VIOLATION,
        );
      }

      if (!userId) {
        throw new BusinessError(
          "Unauthorized",
          ErrorCodes.BUSINESS_RULE_VIOLATION,
        );
      }

      const data = await service.getBusinessCategoryGroups(businessId, userId);

      successResponse({ res, data: data });
    } catch (err: any) {
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  },
);
