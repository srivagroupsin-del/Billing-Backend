import { successResponse } from "../../utils/response";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { CustomerService } from "./customer.service";

export class CustomerController {
  private service = new CustomerService();

  //  GET CUSTOMER BY PHONE
  getCustomerByPhone = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        throw new BusinessError(
          "Unauthorized",
          ErrorCodes.BUSINESS_RULE_VIOLATION,
        );
      }

      const businessId = req.user.business_id;
      if (!businessId) {
        throw new BusinessError(
          "Business ID missing",
          ErrorCodes.BUSINESS_RULE_VIOLATION,
        );
      }

      const phone = req.params.phone as string;
      if (!phone) {
        throw new BusinessError(
          "Phone number required",
          ErrorCodes.BUSINESS_RULE_VIOLATION,
        );
      }

      const customer = await this.service.getCustomerByPhone(businessId, phone);

      return successResponse({ res, data: customer || {} });
    } catch (error: any) {
      console.error("getCustomerByPhone:", error);
      throw new BusinessError(
        error.message,
        ErrorCodes.BUSINESS_RULE_VIOLATION,
      );
    }
  };

  //  GET CUSTOMERS BY BUSINESS
  getCustomerBybusiness = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        throw new BusinessError(
          "Unauthorized",
          ErrorCodes.BUSINESS_RULE_VIOLATION,
        );
      }

      const businessId = req.user.business_id;

      if (!businessId) {
        throw new BusinessError(
          "Business ID missing",
          ErrorCodes.BUSINESS_RULE_VIOLATION,
        );
      }

      const customers = await this.service.getCustomerBybusiness(businessId);

      successResponse({ res, data: customers });
    } catch (error: any) {
      console.error("getCustomerBybusiness:", error);
      throw new BusinessError(
        error.message,
        ErrorCodes.BUSINESS_RULE_VIOLATION,
      );
    }
  };

  //  CENTRAL CUSTOMER
  getCustomerFromCentral = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        throw new BusinessError(
          "Unauthorized",
          ErrorCodes.BUSINESS_RULE_VIOLATION,
        );
      }

      const userId = req.user.id;

      const phone = Array.isArray(req.params.phone)
        ? req.params.phone[0]
        : req.params.phone;

      if (!phone) {
        throw new BusinessError(
          "Phone is required",
          ErrorCodes.BUSINESS_RULE_VIOLATION,
        );
      }

      const data = await this.service.getCustomerFromCentral(userId, phone);

      return successResponse({ res, data: data || {} });
    } catch (err: any) {
      console.error("getCustomerFromCentral:", err);
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getAllBusinesses = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const search = (req.query.search as string) || "";
      const result = await this.service.getAllBusinesses(userId, search);

      successResponse({ res, data: result });
    } catch (err: any) {
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const search = (req.query.search as string) || "";
      const result = await this.service.getAllUsers(userId, search);

      successResponse({ res, data: result });
    } catch (err: any) {
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };
}
