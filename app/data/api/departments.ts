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
  try {
    const response = await axios.get(
      `http://localhost:5173/api/departments?search_term=${search_term}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response?.data?.data as DepartmentInterface;
  } catch (error: any) {
    return {
      status: "error",
      message:
        error.response.message ||
        "An error occurred while fetching departments",
    };
  }
};
