import axios from "axios";
import jwt from "jsonwebtoken";
import * as authRepo from "./auth.repository";
import { getBusinessList } from "../business/business.service";

export const login = async (email: string, password: string) => {
  try {
    // 🔹 Call central API
    const response = await axios.post(
      "https://user.jobes24x7.com/login/authenticate",
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    const apiData = response.data?.data;

    if (!apiData || apiData.result !== "Success") {
      throw new Error("Invalid login");
    }

    const userData = apiData.data;
    const centralToken = apiData.token;
    const expiryISO = apiData.expires_at;

    // 🔥 Convert to MySQL format
    const expiry = new Date(expiryISO)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    // const expiry = apiData.expires_at;

    // 🔹 Find or create user
    let user = await authRepo.findUserByEmail(userData.email);

    if (!user) {
      const newUserId = await authRepo.createUser({
        user_id: userData.user_main_id,
        name: userData.user_name,
        email: userData.email,
        password: "external_auth",
      });

      user = {
        id: newUserId,
        email: userData.email,
        user_id: userData.user_main_id, // 🔥 ADD THIS
      };
    } else {
      // 🔥 Update user_main_id if already exists
      await authRepo.updateUserMainId(user.id, userData.user_main_id);

      user.user_id = userData.user_main_id; // keep in memory
    }

    // 🔹 Store central token
    await authRepo.updateCentralToken(user.id, centralToken, expiry);

    // 🔹 Generate YOUR token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    return {
      token,
      user,
    };
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    throw new Error("Login failed");
  }
};

export const selectBusiness = async (
  userId: number,
  email: string,
  businessId: number,
) => {
  // 🔹 1. Get businesses from CENTRAL API
  const businesses = await getBusinessList(userId);

  // 🔹 2. Validate
  const exists = businesses.find((b: any) => b.id === businessId);

  if (!exists) {
    throw new Error("Invalid business selection");
  }

  // 🔑 3. Generate BUSINESS TOKEN
  const token = jwt.sign(
    {
      id: userId,
      email,
      business_id: businessId,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );

  return {
    token,
    business_id: businessId,
  };
};
