import axios from "axios";
import * as authRepo from "../../modules/auth/auth.repository";

export class SupplierService {
  async getSuppliers(userId: number) {
    const user = await authRepo.getUserById(userId);

    if (!user) throw new Error("User not found");

    if (!user.central_token) {
      throw new Error("Central token missing");
    }

    if (new Date(user.central_token_expiry) < new Date()) {
      throw new Error("Session expired. Please login again.");
    }

    try {
      const response = await axios.get(
        "https://user.jobes24x7.com/api/suppliers",
        {
          headers: {
            Authorization: `Bearer ${user.central_token}`,
            Accept: "application/json",
          },
        },
      );

      const apiData = response.data?.data;

      if (!apiData || apiData.result !== "Success") {
        throw new Error("Failed to fetch suppliers");
      }

      // ✅ FIX HERE
      const supplierList = apiData.data || [];

      return {
        count: supplierList.length,
        suppliers: supplierList.map((s: any) => ({
          id: s.id,
          name: s.business_name,
          phone: s.business_phone,
        })),
      };
    } catch (err: any) {
      console.log("❌ SUPPLIER API ERROR:", err.response?.data || err.message);
      throw new Error("Failed to fetch suppliers");
    }
  }
}
