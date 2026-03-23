import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { StockTypeService } from "./stockType.service";

export class StockTypeController {
  private service = new StockTypeService();

  createStockType = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    const id = await this.service.createStockType(businessId!, req.body);

    res.json({
      success: true,
      message: "Stock type created",
      data: { id },
    });
  };

  getStockTypes = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    const data = await this.service.getStockTypes(businessId!);

    res.json({
      success: true,
      data,
    });
  };

  updateStockType = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    await this.service.updateStockType(
      Number(req.params.id),
      businessId!,
      req.body,
    );

    res.json({
      success: true,
      message: "Stock type updated",
    });
  };

  deleteStockType = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    await this.service.deleteStockType(Number(req.params.id), businessId!);

    res.json({
      success: true,
      message: "Stock type deleted",
    });
  };

  getStockTypesByStock = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const stockId = Number(req.query.stock_id);

      if (!businessId) {
        return res.status(400).json({
          success: false,
          message: "Business ID missing",
        });
      }

      const data = await this.service.getStockTypesByStock(businessId, stockId);

      res.json({
        success: true,
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
