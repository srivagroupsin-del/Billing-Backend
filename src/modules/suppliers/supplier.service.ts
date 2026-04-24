import axios from "axios";
import * as authRepo from "../../modules/auth/auth.repository";

const USER_API = "https://user.jobes24x7.com/api";
const SUPPLIER_API = "https://supplier.jobes24x7.com/api";

export class SupplierService {
  private async getHeaders(userId: number) {
    const user = await authRepo.getUserById(userId);

    if (!user) throw new Error("User not found");
    if (!user.central_token) throw new Error("Central token missing");

    if (new Date(user.central_token_expiry) < new Date()) {
      throw new Error("Session expired");
    }

    return {
      Authorization: `Bearer ${user.central_token}`,
      Accept: "application/json",
    };
  }

  // ✅ CREATE SUPPLIER
  async createSupplier(userId: number, payload: any) {
    const headers = await this.getHeaders(userId);

    const res = await axios.post(`${USER_API}/supplier/create`, payload);

    return res.data;
  }

  // ✅ GET ALL SUPPLIERS
  async getAllSuppliers(userId: number) {
    const headers = await this.getHeaders(userId);

    const res = await axios.get(`${USER_API}/suppliers`);

    return res.data;
  }

  // ✅ GET SINGLE SUPPLIER
  async getSupplierById(userId: number, id: number) {
    const headers = await this.getHeaders(userId);

    const res = await axios.get(`${USER_API}/supplier/${id}`);

    return res.data;
  }

  // ✅ FULL DETAILS
  async getSupplierFull(userId: number, id: number) {
    const headers = await this.getHeaders(userId);

    const res = await axios.get(`${USER_API}/supplier/full/${id}`);

    return res.data;
  }

  // ✅ UPDATE
  async updateSupplier(userId: number, id: number, payload: any) {
    const headers = await this.getHeaders(userId);

    const res = await axios.put(`${USER_API}/supplier/update/${id}`, payload);

    return res.data;
  }

  // ✅ DELETE
  async deleteSupplier(userId: number, id: number) {
    const headers = await this.getHeaders(userId);

    const res = await axios.delete(`${USER_API}/supplier/delete/${id}`);

    return res.data;
  }

  // ============================
  // 🌿 BRANCH APIs
  // ============================

  async createBranch(userId: number, payload: any) {
    const headers = await this.getHeaders(userId);

    const res = await axios.post(`${USER_API}/branch/create`, payload);

    return res.data;
  }

  async getBranches(userId: number, supplierId: number) {
    const headers = await this.getHeaders(userId);

    const res = await axios.get(`${USER_API}/branches/${supplierId}`);

    return res.data;
  }

  async updateBranch(userId: number, id: number, payload: any) {
    const headers = await this.getHeaders(userId);

    const res = await axios.put(`${USER_API}/branch/update/${id}`, payload);

    return res.data;
  }

  async deleteBranch(userId: number, id: number) {
    const headers = await this.getHeaders(userId);

    const res = await axios.delete(`${USER_API}/branch/delete/${id}`);

    return res.data;
  }

  async getSuppliers(userId: number) {
    const headers = await this.getHeaders(userId);

    try {
      const [userApiRes, supplierApiRes] = await Promise.all([
        // 🔐 WITH AUTH
        axios.get(`${USER_API}/suppliers`, { headers }),

        // 🌐 NO AUTH
        axios.get(`${SUPPLIER_API}/suppliers`),
      ]);

      const userList = userApiRes.data?.data?.data || [];

      const supplierRaw = supplierApiRes.data?.data;

      const supplierList = Array.isArray(supplierRaw?.data)
        ? supplierRaw.data
        : Array.isArray(supplierRaw)
          ? supplierRaw
          : [];

      const formattedUser = userList.map((s: any) => ({
        ...s,
        id: `registered-${s.id}`,
        source: "user",
      }));

      const formattedSupplier = supplierList.map((s: any) => ({
        ...s,
        id: `unregistered-${s.id}`,
        source: "supplier",
      }));

      const merged = [...formattedUser, ...formattedSupplier];

      return {
        count: merged.length,
        suppliers: merged,
      };
    } catch (err: any) {
      console.log("❌ MERGE ERROR:", err.response?.data || err.message);
      throw new Error("Failed to fetch suppliers");
    }
  }
}
