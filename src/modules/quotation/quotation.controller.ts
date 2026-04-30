import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { QuotationService } from "./quotation.service";

type SafeUser = {
  id: number;
  business_id: number;
};

export class QuotationController {
  private service = new QuotationService();

  // 🔥 TYPE-SAFE USER
  private getUser(req: AuthRequest): SafeUser {
    if (!req.user || req.user.business_id === undefined) {
      throw new Error("Unauthorized");
    }

    return {
      id: req.user.id,
      business_id: req.user.business_id,
    };
  }

  private handleError(res: Response, err: any) {
    const status = err.message === "Unauthorized" ? 401 : 400;
    return res.status(status).json({
      success: false,
      message: err.message,
    });
  }

  // 🔹 CREATE
  create = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const data = await this.service.create(
        req.body,
        user.id,
        user.business_id,
      );

      res.json({
        success: true,
        message: "Quotation created",
        data,
      });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 LIST
  // 🔥 ALL (Admin)
  getAll = async (_req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.getAll();

      res.json({ success: true, data });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔥 MY (Supplier)
  getMy = async (req: AuthRequest, res: Response) => {
    try {
      const supplierId = req.user?.business_id;

      if (!supplierId) {
        throw new Error("Unauthorized");
      }

      const data = await this.service.getBySupplierId(supplierId);

      res.json({ success: true, data });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 GET SINGLE
  getById = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);
      const id = Number(req.params.id);

      if (!id) throw new Error("Invalid ID");

      const data = await this.service.getById(id, user.business_id);

      res.json({ success: true, data });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 UPDATE
  update = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);
      const id = Number(req.params.id);

      if (!id) throw new Error("Invalid ID");

      const data = await this.service.update(
        id,
        req.body,
        user.id,
        user.business_id,
      );

      res.json({
        success: true,
        message: "Updated",
        data,
      });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 DELETE FULL
  softDelete = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);
      const id = Number(req.params.id);

      if (!id) throw new Error("Invalid ID");

      await this.service.softDelete(id, user.business_id);

      res.json({
        success: true,
        message: "Deleted",
      });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 STATUS UPDATE
  updateStatus = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);
      const id = Number(req.params.id);

      if (!id) throw new Error("Invalid ID");

      const { status } = req.body;

      const data = await this.service.updateStatus(
        id,
        status,
        user.id,
        user.business_id,
      );

      res.json({
        success: true,
        message: "Status updated",
        data,
      });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 DELETE ITEM
  deleteItem = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const itemId = Number(req.params.itemId);
      const quotationId = Number(req.query.quotationId);

      if (!itemId || !quotationId) {
        throw new Error("Invalid IDs");
      }

      await this.service.deleteItem(itemId, quotationId, user.business_id);

      res.json({
        success: true,
        message: "Item deleted",
      });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };
}
