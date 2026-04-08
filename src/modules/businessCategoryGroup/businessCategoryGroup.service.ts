import * as repo from "./businessCategoryGroup.repository";
import { getUserById } from "../auth/auth.repository";
import axios from "axios";

export const getBusinessCategoryGroups = async (
  businessId: number,
  userId: number,
) => {
  const rows: any = await repo.getBusinessCategoryGroups(businessId);
  // 🔹 Get logged-in user
  const user = await getUserById(userId);

  if (!user) throw new Error("User not found");

  if (!user.central_token) {
    throw new Error("Central token missing");
  }

  // 🔒 Expiry check
  if (new Date(user.central_token_expiry) < new Date()) {
    throw new Error("Session expired. Please login again.");
  }

  try {
    const response = await axios.get(
      `https://user.jobes24x7.com/business-cre/main/${user.user_id}`,
      {
        headers: {
          Authorization: `Bearer ${user.central_token}`,
          Accept: "application/json",
        },
      },
    );

    const apiData = response.data?.data;

    if (!apiData || apiData.result !== "Success") {
      throw new Error("Failed to fetch business list");
    }

    const businesses = apiData.data || [];

    const business = businesses.find((b: any) => b.id === businessId);

    const businessName = business?.business_name || null;

    return {
      business_id: businessId,
      business_name: businessName,
      category_groups: rows.map((row: any) => ({
        id: row.category_group_id,
        name: row.category_group_name,
        assigned_at: row.created,
      })),
    };
  } catch (err: any) {
    console.log("❌ CENTRAL ERROR:", err.response?.data || err.message);
    throw new Error("Central API failed");
  }
};
