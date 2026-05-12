import { VariantsRepository } from "./variants.repository";

export class VariantsService {
  private repo = new VariantsRepository();

  async getAll(businessId: number) {
    return await this.repo.getAll(businessId);
  }
}