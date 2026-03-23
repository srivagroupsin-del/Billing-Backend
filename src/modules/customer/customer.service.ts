import { CustomerRepository } from "./customer.repository";

export class CustomerService {
  private repo = new CustomerRepository();

  async getCustomerByPhone(businessId: number, phone: string) {
    const customer = await this.repo.findByPhoneOne(businessId, phone);

    return customer;
  }

  async getCustomerBybusiness(businessId: number) {
    const customer = await this.repo.getCustomerBybusiness(businessId);
    return customer;
  }
}
