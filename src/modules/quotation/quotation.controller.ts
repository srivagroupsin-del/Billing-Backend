import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { QuotationService } from "./quotation.service";

export class QuotationController {
  private service = new QuotationService();

  create = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const data = await this.service.create(req.body, userId);

      res.json({ success: true, message: "Quotation created", data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  getAll = async (_req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.getAll();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getById = async (req: AuthRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await this.service.getById(id);

      res.json({ success: true, data });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  };

  update = async (req: AuthRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const userId = req.user?.id!;

      const data = await this.service.update(id, req.body, userId);

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

  updateStatus = async (req: AuthRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      const userId = req.user?.id!;

      const data = await this.service.updateStatus(id, status, userId);

      res.json({
        success: true,
        message: "Status updated",
        data,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };

  deleteItem = async (req: AuthRequest, res: Response) => {
    try {
      const itemId = Number(req.params.itemId);
      const quotationId = Number(req.query.quotationId); // 👈 important

      await this.service.deleteItem(itemId, quotationId);

      res.json({
        success: true,
        message: "Item deleted",
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };
}
