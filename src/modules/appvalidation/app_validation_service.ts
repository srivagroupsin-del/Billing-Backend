// service file

import axios from "axios";
import { BusinessError } from "../../utils/appError";

const BASE_API_URL = process.env.MOBILE_ADMIN_API_URL;

export const userAppData = async (data: any) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/userlogin/received`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    return response.data;
  } catch (err: any) {
    throw new BusinessError(
      err.response?.data?.message ||
        err.message ||
        "Failed to call external API",
    );
  }
};

export const getUserAppData = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/userlogin/received`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (err: any) {
    throw new BusinessError(
      err.response?.data?.message ||
        err.message ||
        "Failed to fetch user app data",
    );
  }
};
