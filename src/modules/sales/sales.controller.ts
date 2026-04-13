import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { SalesService } from "./sales.service";

export class SalesController {
  private service = new SalesService();

  createBill = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;

      if (!businessId) {
        return res.status(400).json({
          success: false,
          message: "Business ID missing",
        });
      }

      const result = await this.service.createBill(businessId, req.body);

      res.json({
        success: true,
        message: "Bill created successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getBillById = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      if (!businessId)
        return res
          .status(400)
          .json({ success: false, message: "Business ID missing", data: {} });

      const billId = Number(req.params.id);
      if (!billId) {
        return res.status(400).json({
          success: false,
          message: "Invalid Bill ID",
        });
      }

      const bill = await this.service.getBillById(businessId!, billId);

      res.json({
        success: true,
        data: bill,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getBillByNumber = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      if (!businessId)
        return res
          .status(400)
          .json({ success: false, message: "Business ID missing", data: {} });

      const billNumber = Array.isArray(req.params.billNumber)
        ? req.params.billNumber[0]
        : req.params.billNumber;

      const bill = await this.service.getBillByNumber(businessId!, billNumber);

      res.json({
        success: true,
        data: bill,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getBillsByBusiness = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      if (!businessId)
        return res
          .status(400)
          .json({ success: false, message: "Business ID missing", data: {} });

      const bills = await this.service.getBillsByBusiness(businessId!);

      res.json({
        success: true,
        data: bills,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getFullBillDetails = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      if (!businessId)
        return res
          .status(400)
          .json({ success: false, message: "Business ID missing", data: {} });

      const billId = Number(req.params.id);
      if (!billId) {
        return res.status(400).json({
          success: false,
          message: "Invalid Bill ID",
        });
      }

      const data = await this.service.getFullBillDetails(businessId, billId);

      res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
}
