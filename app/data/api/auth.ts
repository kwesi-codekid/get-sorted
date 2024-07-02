import axios from "axios";
import { API_BASE_URL } from "../dotenv";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/login`, {
      email,
      password,
    });

    return response.data;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.response?.statusText,
    };
  }
};
