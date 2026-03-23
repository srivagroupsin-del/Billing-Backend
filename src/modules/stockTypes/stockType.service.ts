import { StockTypeRepository } from "./stockType.repository";

export class StockTypeService {
  private repository = new StockTypeRepository();

  async createStockType(businessId: number, data: any) {
    return this.repository.createStockType(businessId, data);
  }

  async getStockTypes(businessId: number) {
    return this.repository.getStockTypes(businessId);
  }

  async updateStockType(id: number, businessId: number, data: any) {
    return this.repository.updateStockType(id, businessId, data);
  }

  async deleteStockType(id: number, businessId: number) {
    return this.repository.deleteStockType(id, businessId);
  }
  async getStockTypesByStock(businessId: number, stockId: number) {
    if (!stockId) {
      throw new Error("stock_id is required");
    }

    return this.repository.getStockTypesByStock(businessId, stockId);
  }
}
