import { successResponse } from "../../utils/response";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { StockTypeService } from "./stockType.service";

export class StockTypeController {
  private service = new StockTypeService();

  createStockType = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    const id = await this.service.createStockType(businessId!, req.body);

    successResponse({ res, data: { id }, message: "Stock type created" });
  };

  getStockTypes = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    const data = await this.service.getStockTypes(businessId!);

    successResponse({ res, data: data });
  };

  updateStockType = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    await this.service.updateStockType(
      Number(req.params.id),
      businessId!,
      req.body,
    );

    successResponse({ res, message: "Stock type updated" });
  };

  deleteStockType = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    await this.service.deleteStockType(Number(req.params.id), businessId!);

    successResponse({ res, message: "Stock type deleted" });
  };

  getStockTypesByStock = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const stockId = Number(req.query.stock_id);

      if (!businessId) {
        throw new BusinessError("Business ID missing", ErrorCodes.BUSINESS_RULE_VIOLATION);
      }

      const data = await this.service.getStockTypesByStock(businessId, stockId);

      successResponse({ res, data: data });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };
}
