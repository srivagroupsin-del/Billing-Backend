import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { successResponse } from "../../utils/response";
import * as service from "./userTokens.service";

export const createOrUpdate = catchAsync(async (req: Request, res: Response) => {
  const { user_id, user_token } = req.body;
  await service.createOrUpdateUserToken(user_id, user_token);
  return successResponse({
    res,
    message: "User token processed successfully",
  });
});

export const listAndFilter = catchAsync(async (req: Request, res: Response) => {
  const { user_id } = req.query;
  const data = await service.listUserTokens({ user_id: user_id as string });
  return successResponse({
    res,
    data,
  });
});
