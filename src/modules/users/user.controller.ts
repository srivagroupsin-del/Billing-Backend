import { Request, Response } from "express";
import * as userService from "./user.service";

export const getUsers = async (req: Request, res: Response) => {
  const users = await userService.fetchUsers();

  res.json({
    success: true,
    data: users,
  });
};

export const getActiveUsers = async (req: Request, res: Response) => {
  const users = await userService.fetchActiveUsers();

  res.json({
    success: true,
    data: users,
  });
};
