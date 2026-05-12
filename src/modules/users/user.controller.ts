import { catchAsync } from "../../utils/catchAsync";
import { successResponse } from "../../utils/response";
import { Request, Response } from "express";
import * as userService from "./user.service";

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.fetchUsers();

  successResponse({ res, data: users });
});

export const getActiveUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.fetchActiveUsers();

  successResponse({ res, data: users });
});
