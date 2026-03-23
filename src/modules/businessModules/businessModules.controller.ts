import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { BusinessModulesService } from "./businessModules.service";

export class BusinessModulesController {

  private service = new BusinessModulesService();

  /* MODULES */

  createModule = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;
    const id = await this.service.createModule(businessId!, req.body);

    res.json({ success: true, data: { id } });
  };

  getModules = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;
    const data = await this.service.getModules(businessId!);

    res.json({ success: true, data });
  };

  updateModule = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;
    const { id } = req.params;

    await this.service.updateModule(Number(id), businessId!, req.body);

    res.json({ success: true });
  };

  deleteModule = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;
    const { id } = req.params;

    await this.service.deleteModule(Number(id), businessId!);

    res.json({ success: true });
  };

  /* MODULE ITEMS */

  createModuleItem = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;
    const id = await this.service.createModuleItem(businessId!, req.body);

    res.json({ success: true, data: { id } });
  };

  getModuleItems = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;
    const { moduleId } = req.params;

    const data = await this.service.getModuleItems(businessId!, Number(moduleId));

    res.json({ success: true, data });
  };

  updateModuleItem = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;
    const { id } = req.params;

    await this.service.updateModuleItem(Number(id), businessId!, req.body);

    res.json({ success: true });
  };

  deleteModuleItem = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;
    const { id } = req.params;

    await this.service.deleteModuleItem(Number(id), businessId!);

    res.json({ success: true });
  };

}