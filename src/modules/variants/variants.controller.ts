import { successResponse } from "../../utils/response";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { VariantsService } from "./variants.service";

export class VariantsController {
  private service = new VariantsService();

  getAll = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const data = await this.service.getAll(businessId!);

      successResponse({ res, data: data });
    } catch (err: any) {
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };
}