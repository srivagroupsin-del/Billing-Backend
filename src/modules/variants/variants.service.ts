import { VariantsRepository } from "./variants.repository";

export class VariantsService {
  private repo = new VariantsRepository();

  async getAll() {
    return await this.repo.getAll();
  }
}