import axios from "axios";
import { errorToast } from "~/utils/toasters";
import { API_BASE_URL } from "../dotenv";
import { UserInterface } from "~/utils/types";

export const fetchCurrentUser = async (
  token: string
): Promise<UserInterface | undefined> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/get-current-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as UserInterface;
  } catch (error) {
    console.log(error);
    errorToast("Error!", "An error occurred while fetching user data");
  }
};
