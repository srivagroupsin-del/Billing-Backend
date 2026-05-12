import { successResponse } from "../../utils/response";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { SupplierService } from "./supplier.service";

export class SupplierController {
  private service = new SupplierService();

  // ==========================
  // 🧾 SUPPLIER APIs
  // ==========================

  create = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.createSupplier(req.user!.id, req.body);
      successResponse({ res, data: data });
    } catch (err: any) {
      const apiError = err?.response?.data;

      console.error("CREATE SUPPLIER:", apiError || err.message);

      throw new BusinessError(
        apiError?.data?.message || err.message || "Something went wrong",
        ErrorCodes.BUSINESS_RULE_VIOLATION,
      );
    }
  };

  getAll = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.getAllSuppliers(req.user!.id);
      successResponse({ res, data: data });
    } catch (err: any) {
      console.error(" GET SUPPLIERS:", err.message);
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getOne = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.getSupplierById(
        req.user!.id,
        Number(req.params.id),
      );
      successResponse({ res, data: data });
    } catch (err: any) {
      console.error(" GET ONE SUPPLIER:", err.message);
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getFull = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.getSupplierFull(
        req.user!.id,
        Number(req.params.id),
      );
      successResponse({ res, data: data });
    } catch (err: any) {
      console.error(" GET FULL SUPPLIER:", err.message);
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  update = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.updateSupplier(
        req.user!.id,
        Number(req.params.id),
        req.body,
      );
      successResponse({ res, data: data });
    } catch (err: any) {
      console.error(" UPDATE SUPPLIER:", err.message);
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  delete = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.deleteSupplier(
        req.user!.id,
        Number(req.params.id),
      );
      successResponse({ res, data: data });
    } catch (err: any) {
      console.error(" DELETE SUPPLIER:", err.message);
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  // ==========================
  // 🌿 BRANCH APIs
  // ==========================

  createBranch = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.createBranch(req.user!.id, req.body);
      successResponse({ res, data: data });
    } catch (err: any) {
      console.error(" CREATE BRANCH:", err.message);
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getBranches = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.getBranches(
        req.user!.id,
        Number(req.params.supplierId),
      );
      successResponse({ res, data: data });
    } catch (err: any) {
      console.error(" GET BRANCHES:", err.message);
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  updateBranch = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.updateBranch(
        req.user!.id,
        Number(req.params.id),
        req.body,
      );
      successResponse({ res, data: data });
    } catch (err: any) {
      console.error(" UPDATE BRANCH:", err.message);
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  deleteBranch = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.deleteBranch(
        req.user!.id,
        Number(req.params.id),
      );
      successResponse({ res, data: data });
    } catch (err: any) {
      console.error(" DELETE BRANCH:", err.message);
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };
}
