import axios from "axios";
import { API_BASE_URL } from "../dotenv";
import { ActionDataInterface, DepartmentInterface } from "~/utils/types";

export const fetchDepartments = async ({
  token,
  search_term,
  page,
}: {
  token: string;
  search_term?: string;
  page?: string | number;
}): Promise<DepartmentInterface | ActionDataInterface | undefined> => {
  console.log({ token });

  try {
    const response = await axios.get(
      `https://get-sorted-backend.vercel.app/api/departments?search_term=${search_term}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response?.data as DepartmentInterface;
  } catch (error: any) {
    return {
      status: "error",
      message:
        error.response.message ||
        "An error occurred while fetching departments",
    };
  }
};
