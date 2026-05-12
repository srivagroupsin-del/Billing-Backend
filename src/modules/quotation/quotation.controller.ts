import { BusinessError } from "../../utils/appError";
import { successResponse } from "../../utils/response";
import { ErrorCodes } from "../../utils/errorCodes";
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
      throw new BusinessError("Unauthorized")
    }

    return {
      id: req.user.id,
      business_id: req.user.business_id,
    };
  }

  private handleError(res: Response, err: any) {
    const status = err.message === "Unauthorized" ? 401 : 400;
    throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
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

      successResponse({ res, data: data, message: "Quotation created" });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 LIST
  // 🔥 ALL (Admin)
  getAll = async (_req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.getAll();

      successResponse({ res, data: data });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔥 MY (Supplier)
  getMy = async (req: AuthRequest, res: Response) => {
    try {
      const supplierId = req.user?.business_id;

      if (!supplierId) {
        throw new BusinessError("Unauthorized")
      }

      const data = await this.service.getBySupplierId(supplierId);

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

  // 🔹 DELETE FULL
  softDelete = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);
      const id = Number(req.params.id);

      if (!id) throw new BusinessError("Invalid ID")

      await this.service.softDelete(id, user.business_id);

      successResponse({ res, message: "Deleted" });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 STATUS UPDATE
  updateStatus = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);
      const id = Number(req.params.id);

      if (!id) throw new BusinessError("Invalid ID")

      const { status } = req.body;

      const data = await this.service.updateStatus(
        id,
        status,
        user.id,
        user.business_id,
      );

      successResponse({ res, data: data, message: "Status updated" });
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
        throw new BusinessError("Invalid IDs")
      }

      await this.service.deleteItem(itemId, quotationId, user.business_id);

      successResponse({ res, message: "Item deleted" });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };
}
