import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { SupplierRequestService } from "./supplierRequest.service";

export class SupplierRequestController {
  private service = new SupplierRequestService();

  create = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id!;
      const businessId = req.user?.business_id!;

      const data = await this.service.create(req.body, userId, businessId);

      res.json({ success: true, message: "Request created", data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  getAll = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id!;
    const data = await this.service.getAll(businessId);
    res.json({ success: true, data });
  };

  getReceived = async (req: AuthRequest, res: Response) => {
    const supplierId = req.user?.business_id!;

    const data = await this.service.getReceived(supplierId);

    res.json({ success: true, data });
  };

  getById = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id!;
    const data = await this.service.getById(Number(req.params.id), businessId);

    res.json({ success: true, data });
  };

  update = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id!;
    const data = await this.service.update(
      Number(req.params.id),
      req.body,
      userId,
    );

    res.json({ success: true, message: "Updated", data });
  };

  updateStatus = async (req: AuthRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { status, partial_reason } = req.body;
      const userId = req.user?.id!;
      const businessId = req.user?.business_id!; // 🔥 ADD THIS

      const data = await this.service.updateStatus(
        id,
        status,
        partial_reason,
        userId,
        businessId, // 🔥 PASS THIS
      );

      res.json({ success: true, message: "Status updated", data });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };

  softDelete = async (req: AuthRequest, res: Response) => {
    await this.service.softDelete(Number(req.params.id));
    res.json({ success: true, message: "Deleted" });
  };

  deleteItem = async (req: AuthRequest, res: Response) => {
    const itemId = Number(req.params.itemId);
    const requestId = Number(req.query.requestId);

    await this.service.deleteItem(itemId, requestId);

    res.json({ success: true, message: "Item deleted" });
  };
}
