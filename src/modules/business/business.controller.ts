import { catchAsync } from "../../utils/catchAsync";
import { successResponse } from "../../utils/response";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";
import { Request, Response } from "express";
import { getBusinessList } from "./business.service";
import { AuthRequest } from "../../middlewares/auth.middlewares";

export const listBusiness = catchAsync(async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const businesses = await getBusinessList(userId);

    successResponse({ res, data: businesses });
  } catch (err: any) {
    throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
  }
});
