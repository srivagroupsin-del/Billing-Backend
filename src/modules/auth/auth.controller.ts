import { Request, Response } from "express";
import * as authService from "./auth.service";
import { AuthRequest } from "../../middlewares/auth.middlewares";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json({
      success: true,
      data: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

export const selectBusiness = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const email = req.user!.email;
    const { business_id } = req.body;

    const result = await authService.selectBusiness(userId, email, business_id);

    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
