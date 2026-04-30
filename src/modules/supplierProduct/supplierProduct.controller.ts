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
      message: err.message || "Something went wrong",
    });
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

      res.json({
        success: true,
        message: "Created successfully",
        data,
      });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  getAll = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id; // ✅ get user id

      if (!userId) {
        throw new Error("Unauthorized");
      }

      const data = await this.service.getAll(userId); // ✅ PASS userId

      res.json({ success: true, data });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  getMyProducts = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const supplierId = req.user?.business_id; // 🔥 IMPORTANT

      if (!userId || !supplierId) {
        throw new Error("Unauthorized");
      }

      const data = await this.service.getMyProducts(userId, supplierId);

      res.json({
        success: true,
        data,
      });
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

  // 🔹 DELETE
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
}
