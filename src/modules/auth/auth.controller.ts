import { catchAsync } from "../../utils/catchAsync";
import { successResponse } from "../../utils/response";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";
import { Request, Response } from "express";
import * as authService from "./auth.service";
import { AuthRequest } from "../../middlewares/auth.middlewares";

export const login = catchAsync(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    successResponse({ res, data: {
        token: result.token,
        user: result.user,
      } });
  } catch (err: any) {
    throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
  }
});

export const selectBusiness = catchAsync(async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const email = req.user!.email;
    const { business_id } = req.body;

    const result = await authService.selectBusiness(userId, email, business_id);

    successResponse({ res, data: result });
  } catch (err: any) {
    throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
  }
});
