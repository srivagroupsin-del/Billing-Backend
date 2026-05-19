import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { successResponse } from "../../utils/response";
import * as service from "./applicationKeys.service";

export const createOrUpdate = catchAsync(async (req: Request, res: Response) => {
  const { app_id, app_key } = req.body;
  await service.createOrUpdateApplicationKey(app_id, app_key);
  return successResponse({
    res,
    message: "Application key processed successfully",
  });
});

export const listAndFilter = catchAsync(async (req: Request, res: Response) => {
  const { app_id } = req.query;
  const data = await service.listApplicationKeys({ app_id: app_id as string });
  return successResponse({
    res,
    data,
  });
});
