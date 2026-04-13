import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { StockService } from "./stock.service";

export class StockController {
  private service = new StockService();

  saveStock = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;

      if (!businessId)
        return res
          .status(400)
          .json({ success: false, message: "Business ID missing", data: {} });

      const data = await this.service.saveStock(businessId!, req.body);

      res.json({
        success: true,
        message: "Stock saved successfully",
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
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

      res.json({
        success: true,
        message: "Storage assigned",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getStocks = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const businessId = req.user?.business_id;

    if (!businessId)
      return res
        .status(400)
        .json({ success: false, message: "Business ID missing", data: {} });

    const data = await this.service.getStocks(userId, businessId!);

    res.json({ success: true, data });
  };

  getStockById = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const businessId = req.user?.business_id;

    if (!businessId)
      return res
        .status(400)
        .json({ success: false, message: "Business ID missing", data: {} });

    const data = await this.service.getStockById(
      Number(req.params.id),
      userId,
      businessId!,
    );

    res.json({ success: true, data });
  };

  deleteStock = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    if (!businessId)
      return res
        .status(400)
        .json({ success: false, message: "Business ID missing", data: {} });

    await this.service.deleteStock(Number(req.params.id), businessId!);

    res.json({ success: true, message: "Stock deleted" });
  };

  updateStock = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      if (!businessId)
        return res
          .status(400)
          .json({ success: false, message: "Business ID missing", data: {} });

      const stockId = Number(req.params.id);

      const data = await this.service.updateStock(
        stockId,
        businessId!,
        req.body,
      );

      res.json({
        success: true,
        message: "Stock updated successfully",
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
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

      res.json({
        success: true,
        data,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  deleteAssignedLocations = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { stockId } = req.params;

      await this.service.deleteAssignedLocations(Number(stockId), businessId!);

      res.json({
        success: true,
        message: "All storage assignments removed",
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };

  updateSingleLocation = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;

      await this.service.updateSingleLocation(req.body, businessId!);

      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  deleteSingleLocation = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      await this.service.deleteSingleLocation(req.body, businessId!);

      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };
}
