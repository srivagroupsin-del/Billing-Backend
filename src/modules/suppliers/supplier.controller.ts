import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { SupplierService } from "./supplier.service";

export class SupplierController {
  private service = new SupplierService();

  createSupplier = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "Business not selected",
      });
    }

    const id = await this.service.createSupplier(businessId, req.body);

    res.json({
      success: true,
      message: "Supplier created",
      data: { id },
    });
  };

  getSuppliers = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = await this.service.getSuppliers(userId);

    res.json({
      success: true,
      data,
    });
  };

  updateSupplier = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "Business not selected",
      });
    }

    await this.service.updateSupplier(
      Number(req.params.id),
      businessId,
      req.body,
    );

    res.json({
      success: true,
      message: "Supplier updated",
    });
  };

  deleteSupplier = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "Business not selected",
      });
    }

    await this.service.deleteSupplier(Number(req.params.id), businessId);

    res.json({
      success: true,
      message: "Supplier deleted",
    });
  };
}
