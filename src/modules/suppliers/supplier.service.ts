import { SupplierRepository } from "./supplier.repository";

export class SupplierService {
  private repository = new SupplierRepository();

  async createSupplier(businessId: number, data: any) {
    return this.repository.createSupplier(businessId, data);
  }

  async getSuppliers(businessId: number) {
    return this.repository.getSuppliers(businessId);
  }

  async updateSupplier(id: number, businessId: number, data: any) {
    return this.repository.updateSupplier(id, businessId, data);
  }

  async deleteSupplier(id: number, businessId: number) {
    return this.repository.deleteSupplier(id, businessId);
  }
}
