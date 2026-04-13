import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { CustomerService } from "./customer.service";

export class CustomerController {
  private service = new CustomerService();

  // ✅ GET CUSTOMER BY PHONE
  getCustomerByPhone = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const businessId = req.user.business_id;
      if (!businessId) {
        return res.status(400).json({
          success: false,
          message: "Business ID missing",
          data: {},
        });
      }

      const phone = req.params.phone as string;
      if (!phone) {
        return res.status(400).json({
          success: false,
          message: "Phone number required",
        });
      }

      const customer = await this.service.getCustomerByPhone(businessId, phone);

      return res.json({
        success: true,
        exists: !!customer,
        data: customer || {},
      });
    } catch (error: any) {
      console.error("❌ getCustomerByPhone:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  // ✅ GET CUSTOMERS BY BUSINESS
  getCustomerBybusiness = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const businessId = req.user.business_id;

      if (!businessId) {
        return res.status(400).json({
          success: false,
          message: "Business ID missing",
        });
      }

      const customers = await this.service.getCustomerBybusiness(businessId);

      res.json({
        success: true,
        data: customers,
      });
    } catch (error: any) {
      console.error("❌ getCustomerBybusiness:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  // ✅ CENTRAL CUSTOMER
  getCustomerFromCentral = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const userId = req.user.id;

      const phone = Array.isArray(req.params.phone)
        ? req.params.phone[0]
        : req.params.phone;

      if (!phone) {
        return res.status(400).json({
          success: false,
          message: "Phone is required",
        });
      }

      const data = await this.service.getCustomerFromCentral(userId, phone);

      return res.json({
        success: true,
        exists: !!data,
        data: data || {},
      });
    } catch (err: any) {
      console.error("❌ getCustomerFromCentral:", err);
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };

  getAllBusinesses = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const search = (req.query.search as string) || "";
      const result = await this.service.getAllBusinesses(userId, search);

      res.json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };

  getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const search = (req.query.search as string) || "";
      const result = await this.service.getAllUsers(userId, search);

      res.json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };
}
