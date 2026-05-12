import { successResponse } from "../../utils/response";
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { VariantMasterService } from "./variantMaster.service";

export class VariantMasterController {
  private service = new VariantMasterService();

  createVariant = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    const id = await this.service.createVariant(businessId!, req.body);

    successResponse({ res, data: { id }, message: "Variant created" });
  };

  getVariants = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    const data = await this.service.getVariants(businessId!);

    successResponse({ res, data: data });
  };

  updateVariant = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    await this.service.updateVariant(
      Number(req.params.id),
      businessId!,
      req.body,
    );

    successResponse({ res, message: "Variant updated" });
  };

  deleteVariant = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    await this.service.deleteVariant(Number(req.params.id), businessId!);

    successResponse({ res, message: "Variant deleted" });
  };
}
