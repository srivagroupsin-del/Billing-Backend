import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { SupplierService } from "./supplier.service";

export class SupplierController {
  private service = new SupplierService();

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
}
