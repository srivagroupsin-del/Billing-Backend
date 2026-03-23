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
        return res.status(400).json({ success: false, message: "Business ID missing", data: {} });

      const ids = await this.service.allocateProducts(businessId, req.body);

      res.status(201).json({
        success: true,
        message: "Products allocated",
        data: ids
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message, data: {} });
    }
  };

  getAllocatedProducts = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;

      const data = await this.service.getAllocatedProducts(businessId!);

      res.status(200).json({
        success: true,
        message: "Allocated products fetched",
        data
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message, data: {} });
    }
  };

  updateAllocation = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id } = req.params;

      await this.service.updateAllocation(Number(id), businessId!, req.body);

      res.status(200).json({
        success: true,
        message: "Allocation updated",
        data: {}
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message, data: {} });
    }
  };

  deleteAllocation = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id } = req.params;

      await this.service.deleteAllocation(Number(id), businessId!);

      res.status(200).json({
        success: true,
        message: "Allocation deleted",
        data: {}
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message, data: {} });
    }
  };
}