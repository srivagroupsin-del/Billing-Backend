import { BusinessError } from "../../utils/appError";
import { successResponse } from "../../utils/response";
import { ErrorCodes } from "../../utils/errorCodes";
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
      throw new BusinessError("Unauthorized")
    }

    return {
      id: req.user.id,
      business_id: req.user.business_id,
    };
  }

  // 🔥 COMMON ERROR HANDLER
  private handleError(res: Response, err: any) {
    const status = err.message === "Unauthorized" ? 401 : 400;

    throw new BusinessError(err.message || "Something went wrong", ErrorCodes.BUSINESS_RULE_VIOLATION);
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

      successResponse({ res, data: data, message: "Request created" });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 SENT REQUESTS
  getAll = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const data = await this.service.getAll(user.business_id, user.id);

      successResponse({ res, data: data });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 RECEIVED REQUESTS
  getReceived = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const data = await this.service.getReceived(user.business_id, user.id);

      successResponse({ res, data: data });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 GET SINGLE
  getById = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const id = Number(req.params.id);
      if (!id) throw new BusinessError("Invalid ID")

      const data = await this.service.getById(id, user.business_id);

      successResponse({ res, data: data });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 UPDATE
  update = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const id = Number(req.params.id);
      if (!id) throw new BusinessError("Invalid ID")

      const data = await this.service.update(
        id,
        req.body,
        user.id,
        user.business_id,
      );

      successResponse({ res, data: data, message: "Updated" });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 UPDATE STATUS
  updateStatus = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const id = Number(req.params.id);
      if (!id) throw new BusinessError("Invalid ID")

      const { status, partial_reason } = req.body;

      const data = await this.service.updateStatus(
        id,
        status,
        partial_reason,
        user.id,
        user.business_id,
      );

      successResponse({ res, data: data, message: "Status updated" });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 DELETE FULL REQUEST
  softDelete = async (req: AuthRequest, res: Response) => {
    try {
      this.getUser(req);

      const id = Number(req.params.id);
      if (!id) throw new BusinessError("Invalid ID")

      await this.service.softDelete(id);

      successResponse({ res, message: "Deleted" });
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

      if (!itemId) throw new BusinessError("Invalid itemId")
      if (!requestId) throw new BusinessError("requestId is required")

      // 🔥 PASS businessId
      await this.service.deleteItem(itemId, requestId, user.business_id);

      successResponse({ res, message: "Item deleted" });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };
}
