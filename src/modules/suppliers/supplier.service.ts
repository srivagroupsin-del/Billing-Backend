import axios from "axios";
import * as authRepo from "../../modules/auth/auth.repository";
import { getAuthHeadersAuth } from "../../utils/getAuthHeaders";

const USER_API = "https://supplier.jobes24x7.com/api";

export class SupplierService {
  private async getHeaders(userId: number) {
    const user = await authRepo.getUserById(userId);

    if (!user) throw new Error("User not found");
    if (!user.central_token) throw new Error("Central token missing");

    if (new Date(user.central_token_expiry) < new Date()) {
      throw new Error("Session expired");
    }

    const apiHeaders = await getAuthHeadersAuth();

    return {
      ...apiHeaders,
      Authorization: `Bearer ${user.central_token}`,
      Accept: "application/json",
    };
  }

  // ✅ CREATE SUPPLIER
  async createSupplier(userId: number, payload: any) {
    const headers = await this.getHeaders(userId);

    const res = await axios.post(`${USER_API}/supplier/create`, payload, {
      headers,
    });

    return res.data;
  }

  // ✅ GET ALL SUPPLIERS
  async getAllSuppliers(userId: number) {
    const headers = await this.getHeaders(userId);

    const res = await axios.get(`${USER_API}/suppliers`, { headers });

    return res.data;
  }

  // ✅ GET SINGLE SUPPLIER
  async getSupplierById(userId: number, id: number) {
    const headers = await this.getHeaders(userId);

    const res = await axios.get(`${USER_API}/supplier/${id}`, { headers });

    return res.data;
  }

  // ✅ FULL DETAILS
  async getSupplierFull(userId: number, id: number) {
    const headers = await this.getHeaders(userId);

    const res = await axios.get(`${USER_API}/supplier/full/${id}`, { headers });

    return res.data;
  }

  // ✅ UPDATE
  async updateSupplier(userId: number, id: number, payload: any) {
    const headers = await this.getHeaders(userId);

    const res = await axios.put(`${USER_API}/supplier/update/${id}`, payload, {
      headers,
    });

    return res.data;
  }

  // ✅ DELETE
  async deleteSupplier(userId: number, id: number) {
    const headers = await this.getHeaders(userId);

    const res = await axios.delete(`${USER_API}/supplier/delete/${id}`, {
      headers,
    });

    return res.data;
  }

  // ============================
  // 🌿 BRANCH APIs
  // ============================

  async createBranch(userId: number, payload: any) {
    const headers = await this.getHeaders(userId);

    const res = await axios.post(`${USER_API}/branch/create`, payload, {
      headers,
    });

    return res.data;
  }

  async getBranches(userId: number, supplierId: number) {
    const headers = await this.getHeaders(userId);

    const res = await axios.get(`${USER_API}/branches/${supplierId}`, {
      headers,
    });

    return res.data;
  }

  async updateBranch(userId: number, id: number, payload: any) {
    const headers = await this.getHeaders(userId);

    const res = await axios.put(`${USER_API}/branch/update/${id}`, payload, {
      headers,
    });

    return res.data;
  }

  async deleteBranch(userId: number, id: number) {
    const headers = await this.getHeaders(userId);

    const res = await axios.delete(`${USER_API}/branch/delete/${id}`, {
      headers,
    });

    return res.data;
  }
}
