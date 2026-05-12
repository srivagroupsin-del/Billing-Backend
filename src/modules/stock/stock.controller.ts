import { successResponse } from "../../utils/response";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { StockService } from "./stock.service";

export class StockController {
  private service = new StockService();

  saveStock = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;

      if (!businessId)
        throw new BusinessError("Business ID missing", ErrorCodes.BUSINESS_RULE_VIOLATION);

      const data = await this.service.saveStock(businessId!, req.body);

      successResponse({ res, data: data, message: "Stock saved successfully" });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  assignStockLocations = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { stockId } = req.params;

      await this.service.assignStockLocations(
        Number(stockId),
        businessId!,
        req.body,
      );

      successResponse({ res, message: "Storage assigned" });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getStocks = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const businessId = req.user?.business_id;

    if (!businessId)
      throw new BusinessError("Business ID missing", ErrorCodes.BUSINESS_RULE_VIOLATION);

    const data = await this.service.getStocks(userId, businessId!);

    successResponse({ res, data: data });
  };

  getStockById = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    if (!businessId)
      throw new BusinessError("Business ID missing", ErrorCodes.BUSINESS_RULE_VIOLATION);

    const data = await this.service.getStockById(
      Number(req.params.id),
      businessId!,
    );

    successResponse({ res, data: data });
  };

  deleteStock = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    if (!businessId)
      throw new BusinessError("Business ID missing", ErrorCodes.BUSINESS_RULE_VIOLATION);

    await this.service.deleteStock(Number(req.params.id), businessId!);

    successResponse({ res, message: "Stock deleted" });
  };

  updateStock = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      if (!businessId)
        throw new BusinessError("Business ID missing", ErrorCodes.BUSINESS_RULE_VIOLATION);

      const stockId = Number(req.params.id);

      const data = await this.service.updateStock(
        stockId,
        businessId!,
        req.body,
      );

      successResponse({ res, data: data, message: "Stock updated successfully" });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getAssignedLocations = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { stockId } = req.params;

      const data = await this.service.getAssignedLocations(
        Number(stockId),
        businessId!,
      );

      successResponse({ res, data: data });
    } catch (err: any) {
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  deleteAssignedLocations = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { stockId } = req.params;

      await this.service.deleteAssignedLocations(Number(stockId), businessId!);

      successResponse({ res, message: "All storage assignments removed" });
    } catch (err: any) {
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  updateSingleLocation = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;

      await this.service.updateSingleLocation(req.body, businessId!);

      successResponse({ res });
    } catch (err: any) {
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  deleteSingleLocation = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      await this.service.deleteSingleLocation(req.body, businessId!);

      successResponse({ res });
    } catch (err: any) {
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };
}
