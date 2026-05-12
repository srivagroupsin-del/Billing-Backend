import { VariantMasterRepository } from "./variantMaster.repository";

export class VariantMasterService {
  private repository = new VariantMasterRepository();

  async createVariant(businessId: number, data: any) {
    return this.repository.createVariant(businessId, data);
  }

  async getVariants(businessId: number) {
    return this.repository.getVariants(businessId);
  }

  async updateVariant(id: number, businessId: number, data: any) {
    return this.repository.updateVariant(id, businessId, data);
  }

  async deleteVariant(id: number, businessId: number) {
    return this.repository.deleteVariant(id, businessId);
  }
}
