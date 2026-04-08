import { Request, Response } from "express";
import { getBusinessList } from "./business.service";
import { AuthRequest } from "../../middlewares/auth.middlewares";

export const listBusiness = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const businesses = await getBusinessList(userId);

    res.json({
      success: true,
      data: businesses,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
