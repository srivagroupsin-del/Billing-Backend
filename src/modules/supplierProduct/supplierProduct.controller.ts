import { BusinessError } from "../../utils/appError";
import { successResponse } from "../../utils/response";
import { ErrorCodes } from "../../utils/errorCodes";
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { SupplierProductService } from "./supplierProduct.service";

type SafeUser = {
  id: number;
  business_id: number;
};

export class SupplierProductController {
  private service = new SupplierProductService();

  private getUser(req: AuthRequest): SafeUser {
    if (!req.user || req.user.business_id === undefined) {
      throw new BusinessError("Unauthorized");
    }

    return {
      id: req.user.id,
      business_id: req.user.business_id,
    };
  }

  private handleError(res: Response, err: any) {
    const status = err.message === "Unauthorized" ? 401 : 400;

    throw new BusinessError(
      err.message || "Something went wrong",
      ErrorCodes.BUSINESS_RULE_VIOLATION,
    );
  }

  // 🔹 CREATE
  createBulk = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const data = await this.service.createBulk(
        req.body.data,
        user.id,
        user.business_id,
      );

      successResponse({ res, data: data, message: "Created successfully" });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  getAll = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const data = await this.service.getAll(user.id); //  PASS userId

      successResponse({ res, data: data });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  getMyProducts = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const data = await this.service.getMyProducts(user.id, user.business_id);

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
      if (!id) throw new BusinessError("Invalid ID");

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

  // 🔹 DELETE
  softDelete = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const id = Number(req.params.id);
      if (!id) throw new BusinessError("Invalid ID");

      await this.service.softDelete(id, user.business_id);

      successResponse({ res, message: "Deleted" });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };
}
