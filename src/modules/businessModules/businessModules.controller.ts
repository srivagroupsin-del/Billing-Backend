import { successResponse } from "../../utils/response";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { BusinessModulesService } from "./businessModules.service";

export class BusinessModulesController {
  private service = new BusinessModulesService();

  /* MODULES */

  createModule = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;

      const id = await this.service.createModule(businessId!, req.body);

      successResponse({ res, data: { id } });
    } catch (err: any) {
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getModules = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;
    const data = await this.service.getModules(businessId!);

    successResponse({ res, data: data });
  };

  updateModule = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id } = req.params;

      await this.service.updateModule(Number(id), businessId!, req.body);

      successResponse({ res });
    } catch (err: any) {
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  deleteModule = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;
    const { id } = req.params;

    await this.service.deleteModule(Number(id), businessId!);

    successResponse({ res });
  };

  /* MODULE ITEMS */
  createModuleItem = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;

      const id = await this.service.createModuleItem(businessId!, req.body);

      successResponse({ res, data: { id } });
    } catch (err: any) {
      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getModuleItems = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;
    const { moduleId } = req.params;

    const data = await this.service.getModuleItems(
      businessId!,
      Number(moduleId),
    );

    successResponse({ res, data: data });
  };

  updateModuleItem = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;
    const { id } = req.params;

    await this.service.updateModuleItem(Number(id), businessId!, req.body);

    successResponse({ res });
  };

  deleteModuleItem = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;
    const { id } = req.params;

    await this.service.deleteModuleItem(Number(id), businessId!);

    successResponse({ res });
  };
}
