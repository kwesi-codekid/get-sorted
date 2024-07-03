import axios from "axios";
import { errorToast } from "~/utils/toasters";

// begin:: fetcher

export const fetcher = (token: string) => async (url: string) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);

    return response.data;
  } catch (error: any) {
    console.log(error);

    errorToast(
      error.message,
      "An unexpected error occurred while fetching data. Please try again..."
    );
  }
};

// end:: fetcher
