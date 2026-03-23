import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { StockService } from "./stock.service";

export class StockController {
  private service = new StockService();

  saveStock = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;

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

  getStocks = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    const data = await this.service.getStocks(businessId!);

    res.json({ success: true, data });
  };

  getStockById = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    const data = await this.service.getStockById(
      Number(req.params.id),
      businessId!,
    );

    res.json({ success: true, data });
  };

  deleteStock = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    await this.service.deleteStock(Number(req.params.id), businessId!);

    res.json({ success: true, message: "Stock deleted" });
  };

  updateStock = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
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
}
