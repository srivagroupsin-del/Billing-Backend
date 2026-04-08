import { BusinessModulesRepository } from "./businessModules.repository";

export class BusinessModulesService {
  private repository = new BusinessModulesRepository();

  /* MODULES */

  createModule(businessId: number, data: any) {
    return this.repository.createModule(businessId, data.name);
  }

  getModules(businessId: number) {
    return this.repository.getModules(businessId);
  }

  updateModule(id: number, businessId: number, data: any) {
    return this.repository.updateModule(id, businessId, data.name);
  }

  deleteModule(id: number, businessId: number) {
    return this.repository.deleteModule(id, businessId);
  }

  /* MODULE ITEMS */

  createModuleItem(businessId: number, data: any) {
    return this.repository.createModuleItem(
      businessId,
      data.module_id,
      data.name,
    );
  }

  getModuleItems(businessId: number, moduleId: number) {
    return this.repository.getModuleItems(businessId, moduleId);
  }

  updateModuleItem(id: number, businessId: number, data: any) {
    return this.repository.updateModuleItem(id, businessId, data.name);
  }

  deleteModuleItem(id: number, businessId: number) {
    return this.repository.deleteModuleItem(id, businessId);
  }
}
