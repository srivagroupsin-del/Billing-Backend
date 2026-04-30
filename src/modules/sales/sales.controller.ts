import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { SalesService } from "./sales.service";

type SafeUser = {
  id: number;
  business_id: number;
};

export class SalesController {
  private service = new SalesService();

  // 🔥 COMMON USER VALIDATION
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
    const status =
      err.message === "Unauthorized"
        ? 401
        : err.message.includes("missing") || err.message.includes("Invalid")
          ? 400
          : 500;

    return res.status(status).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }

  // 🔹 CREATE BILL
  createBill = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const result = await this.service.createBill(user.business_id, req.body);

      res.json({
        success: true,
        message: "Bill created successfully",
        data: result,
      });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 GET BILL BY ID
  getBillById = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const billId = Number(req.params.id);
      if (!billId) throw new Error("Invalid Bill ID");

      const bill = await this.service.getBillById(user.business_id, billId);

      res.json({
        success: true,
        data: bill,
      });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 GET BILL BY NUMBER
  getBillByNumber = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const billNumber = Array.isArray(req.params.billNumber)
        ? req.params.billNumber[0]
        : req.params.billNumber;

      if (!billNumber) throw new Error("Bill number required");

      const bill = await this.service.getBillByNumber(
        user.business_id,
        billNumber,
      );

      res.json({
        success: true,
        data: bill,
      });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 LIST ALL BILLS
  getBillsByBusiness = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const bills = await this.service.getBillsByBusiness(user.business_id);

      res.json({
        success: true,
        data: bills,
      });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };

  // 🔹 FULL BILL DETAILS (WITH ITEMS + MOVEMENTS)
  getFullBillDetails = async (req: AuthRequest, res: Response) => {
    try {
      const user = this.getUser(req);

      const billId = Number(req.params.id);
      if (!billId) throw new Error("Invalid Bill ID");

      const data = await this.service.getFullBillDetails(
        user.business_id,
        billId,
      );

      res.json({
        success: true,
        data,
      });
    } catch (err: any) {
      this.handleError(res, err);
    }
  };
}
