import { successResponse } from "../../utils/response";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { ProductAllocationService } from "./productAllocation.service";

export class ProductAllocationController {
  private service: ProductAllocationService;

  constructor() {
    this.service = new ProductAllocationService();
  }

  allocateProducts = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      if (!businessId)
        throw new BusinessError("Business ID missing", ErrorCodes.BUSINESS_RULE_VIOLATION);

      const ids = await this.service.allocateProducts(businessId, req.body);

      successResponse({ res, data: ids, message: "Products allocated", statusCode: 201 });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getAllocatedProducts = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;

      if (!businessId)
        throw new BusinessError("Business ID missing", ErrorCodes.BUSINESS_RULE_VIOLATION);

      const data = await this.service.getAllocatedProducts(businessId!);

      successResponse({ res, data: data, message: "Allocated products fetched", statusCode: 200 });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  updateAllocation = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;

      if (!businessId)
        throw new BusinessError("Business ID missing", ErrorCodes.BUSINESS_RULE_VIOLATION);

      const { id } = req.params;

      await this.service.updateAllocation(Number(id), businessId!, req.body);

      successResponse({ res, data: {}, message: "Allocation updated", statusCode: 200 });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  deleteAllocation = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      if (!businessId)
        throw new BusinessError("Business ID missing", ErrorCodes.BUSINESS_RULE_VIOLATION);

      const { id } = req.params;

      await this.service.deleteAllocation(Number(id), businessId!);

      successResponse({ res, data: {}, message: "Allocation deleted", statusCode: 200 });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };
}
