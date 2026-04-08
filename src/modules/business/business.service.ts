import axios from "axios";
import * as authRepo from "../auth/auth.repository";

export const getBusinessList = async (userId: number) => {
  // 🔹 1. Get user from DB
  const user = await authRepo.getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.central_token) {
    throw new Error("Central token missing");
  }

  if (!user.user_id) {
    throw new Error("user_main_id missing");
  }

  // 🔒 Expiry check
  if (new Date(user.central_token_expiry) < new Date()) {
    throw new Error("Session expired. Please login again.");
  }

  // 🔹 2. Call THEIR API
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

  return apiData.data; // 🔥 actual business array
};
