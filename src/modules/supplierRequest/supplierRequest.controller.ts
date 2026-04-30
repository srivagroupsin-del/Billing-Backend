import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { SupplierRequestService } from "./supplierRequest.service";

type SafeUser = {
  id: number;
  business_id: number;
};

export class SupplierRequestController {
  private service = new SupplierRequestService();

  // 🔥 AUTH HELPER (TYPE-SAFE)
  private getUser(req: AuthRequest): SafeUser {
    if (!req.user || req.user.business_id === undefined) {
      throw new Error("Unauthorized");
    }

    return {
      id: req.user.id,
      business_id: req.user.business_id,
    };
  }

  // 🔥 COMMON ERROR HANDLER
  private handleError(res: Response, err: any) {
    const status = err.message === "Unauthorized" ? 401 : 400;

    return res.status(status).json({
      success: false,
      message: err.message || "Something went wrong",
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
        message: "Request created",
        data,
      });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 SENT REQUESTS
  getAll = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const data = await this.service.getAll(user.business_id, user.id);

      res.json({ success: true, data });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 RECEIVED REQUESTS
  getReceived = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const data = await this.service.getReceived(user.business_id, user.id);

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

  // 🔹 UPDATE STATUS
  updateStatus = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const id = Number(req.params.id);
      if (!id) throw new Error("Invalid ID");

      const { status, partial_reason } = req.body;

      const data = await this.service.updateStatus(
        id,
        status,
        partial_reason,
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

  // 🔹 DELETE FULL REQUEST
  softDelete = async (req: AuthRequest, res: Response) => {
    try {
      this.getUser(req);

      const id = Number(req.params.id);
      if (!id) throw new Error("Invalid ID");

      await this.service.softDelete(id);

      res.json({
        success: true,
        message: "Deleted",
      });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 DELETE SINGLE ITEM
  deleteItem = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req); // 🔥 get user properly

      const itemId = Number(req.params.itemId);
      const requestId = Number(req.query.requestId);

      if (!itemId) throw new Error("Invalid itemId");
      if (!requestId) throw new Error("requestId is required");

      // 🔥 PASS businessId
      await this.service.deleteItem(itemId, requestId, user.business_id);

      res.json({
        success: true,
        message: "Item deleted",
      });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };
}
