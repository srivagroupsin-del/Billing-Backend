import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { CustomerService } from "./customer.service";

export class CustomerController {
  private service = new CustomerService();

  getCustomerByPhone = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const phone = req.params.phone as string;
      if (!phone) {
        return res.status(400).json({
          success: false,
          message: "Phone number required",
        });
      }

      const customer = await this.service.getCustomerByPhone(
        businessId!,
        phone,
      );

      if (customer) {
        return res.json({
          success: true,
          exists: true,
          data: customer,
        });
      }

      res.json({
        success: true,
        exists: false,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getCustomerBybusiness = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;

      const customers = await this.service.getCustomerBybusiness(businessId!);
      res.json({
        success: true,
        data: customers,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
}
