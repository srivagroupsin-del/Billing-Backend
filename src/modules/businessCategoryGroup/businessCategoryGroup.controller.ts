import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import * as service from "./businessCategoryGroup.service";

export const getBusinessCategoryGroups = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const businessId = req.user?.business_id;

    if (!businessId) {
    return res.status(400).json({
        success: false,
        message: "Please select a business",
    });
    }

    const data = await service.getBusinessCategoryGroups(businessId);

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
