import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { SupplierProductService } from "./supplierProduct.service";

export class SupplierProductController {
  private service = new SupplierProductService();

  createBulk = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const result = await this.service.createBulk(req.body.data, userId);

      res.json({
        success: true,
        message: "Created successfully",
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  getAll = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.getAll();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  update = async (req: AuthRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const userId = req.user?.id;

      const data = await this.service.update(id, req.body, userId!);

      res.json({ success: true, message: "Updated", data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  softDelete = async (req: AuthRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.service.softDelete(id);

      res.json({ success: true, message: "Deleted" });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };
}
