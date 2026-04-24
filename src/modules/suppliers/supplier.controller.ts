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
      res.json({ success: true, data });
    } catch (err: any) {
      console.error("❌ CREATE SUPPLIER:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getAll = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.getSuppliers(req.user!.id);
      res.json({ success: true, data });
    } catch (err: any) {
      console.error("❌ GET SUPPLIERS:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getOne = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.getSupplierById(
        req.user!.id,
        Number(req.params.id),
      );
      res.json({ success: true, data });
    } catch (err: any) {
      console.error("❌ GET ONE SUPPLIER:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getFull = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.getSupplierFull(
        req.user!.id,
        Number(req.params.id),
      );
      res.json({ success: true, data });
    } catch (err: any) {
      console.error("❌ GET FULL SUPPLIER:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  update = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.updateSupplier(
        req.user!.id,
        Number(req.params.id),
        req.body,
      );
      res.json({ success: true, data });
    } catch (err: any) {
      console.error("❌ UPDATE SUPPLIER:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  delete = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.deleteSupplier(
        req.user!.id,
        Number(req.params.id),
      );
      res.json({ success: true, data });
    } catch (err: any) {
      console.error("❌ DELETE SUPPLIER:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ==========================
  // 🌿 BRANCH APIs
  // ==========================

  createBranch = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.createBranch(req.user!.id, req.body);
      res.json({ success: true, data });
    } catch (err: any) {
      console.error("❌ CREATE BRANCH:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getBranches = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.getBranches(
        req.user!.id,
        Number(req.params.supplierId),
      );
      res.json({ success: true, data });
    } catch (err: any) {
      console.error("❌ GET BRANCHES:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  updateBranch = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.updateBranch(
        req.user!.id,
        Number(req.params.id),
        req.body,
      );
      res.json({ success: true, data });
    } catch (err: any) {
      console.error("❌ UPDATE BRANCH:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  deleteBranch = async (req: AuthRequest, res: Response) => {
    try {
      const data = await this.service.deleteBranch(
        req.user!.id,
        Number(req.params.id),
      );
      res.json({ success: true, data });
    } catch (err: any) {
      console.error("❌ DELETE BRANCH:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  };
}
