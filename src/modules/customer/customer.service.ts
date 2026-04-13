import { CustomerRepository } from "./customer.repository";
import axios from "axios";
import * as authRepo from "../auth/auth.repository";

export class CustomerService {
  private repo = new CustomerRepository();

  async getCustomerByPhone(businessId: number, phone: string) {
    return await this.repo.findByPhoneOne(businessId, phone);
  }

  async getCustomerBybusiness(businessId: number) {
    return await this.repo.getCustomerBybusiness(businessId);
  }

  async getCustomerFromCentral(userId: number, phone: string) {
    const user = await authRepo.getUserById(userId);

    if (!user) throw new Error("User not found");
    if (!user.central_token) throw new Error("Central token missing");

    if (new Date(user.central_token_expiry) < new Date()) {
      throw new Error("Session expired. Please login again.");
    }

    try {
      const response = await axios.get(
        `https://user.jobes24x7.com/api/login/phone/${phone}`,
        {
          headers: {
            Authorization: `Bearer ${user.central_token}`,
            Accept: "application/json",
          },
          timeout: 5000, // ✅ important
        },
      );

      const apiData = response.data?.data;

      if (!apiData || apiData.result !== "Success") {
        return null;
      }

      const u = apiData.data;

      return {
        id: u.id,
        name: u.user_name,
        phone,
        user_main_id: u.user_main_id,
      };
    } catch (err: any) {
      const errorData = err.response?.data;

      console.log("❌ CUSTOMER API ERROR:", errorData || err.message);

      if (errorData?.data?.code === 403) {
        return null; // 🔥 NOT ERROR — just no access
      }

      throw new Error("Central customer fetch failed");
    }
  }

  getAllBusinesses = async (userId: number, search: string) => {
    const user = await authRepo.getUserById(userId);

    if (!user) throw new Error("User not found");

    if (!user.central_token) {
      throw new Error("Central token missing");
    }

    if (new Date(user.central_token_expiry) < new Date()) {
      throw new Error("Session expired. Please login again.");
    }

    const response = await axios.get(
      `https://user.jobes24x7.com/api/business-cres`,
      {
        headers: {
          Authorization: `Bearer ${user.central_token}`,
          Accept: "application/json",
        },
      },
    );

    const apiData = response.data?.data;

    if (!apiData || apiData.result !== "Success") {
      throw new Error("Failed to fetch businesses");
    }

    let businesses = apiData.data;

    // ✅ MULTI FIELD SEARCH (SAFE VERSION)
    const fields = [
      "user_main_id",
      "business_name",
      "business_email",
      "business_phone",
      "business_pan",
      "pan_number",
      "gst_number",
      "current_account_number",
    ];

    if (search) {
      const s = search.toLowerCase();

      businesses = businesses.filter((b: any) =>
        fields.some((field) =>
          String(b[field] || "")
            .toLowerCase()
            .includes(s),
        ),
      );
    }

    return {
      count: businesses.length,
      data: businesses,
    };
  };

  getAllUsers = async (userId: number, search: string) => {
    const user = await authRepo.getUserById(userId);

    if (!user) throw new Error("User not found");

    if (!user.central_token) {
      throw new Error("Central token missing");
    }

    if (new Date(user.central_token_expiry) < new Date()) {
      throw new Error("Session expired. Please login again.");
    }

    const response = await axios.get(
      `https://user.jobes24x7.com/api/logins/non-register`,
      {
        headers: {
          Authorization: `Bearer ${user.central_token}`,
          Accept: "application/json",
        },
      },
    );

    const apiData = response.data?.data;

    if (!apiData || apiData.result !== "Success") {
      throw new Error("Failed to fetch users");
    }

    let users = apiData.data;

    // 🔥 TRANSFORM DATA (IMPORTANT)
    let formattedUsers = users.map((u: any) => ({
      external_customer_id: u.id, // ✅ main ID
      customer_type: "USER",

      customer_name: u.user_name,
      customer_phone: u.phone_number,

      customer_meta: {
        email: u.email || null,
        address: u.address || null,
      },
    }));

    // 🔍 SEARCH (FIXED)
    if (search) {
      const s = search.toLowerCase();

      formattedUsers = formattedUsers.filter((u: any) =>
        [u.customer_name, u.customer_phone, u.external_customer_id]
          .join(" ")
          .toLowerCase()
          .includes(s),
      );
    }

    return {
      count: formattedUsers.length,
      data: formattedUsers,
    };
  };
}
