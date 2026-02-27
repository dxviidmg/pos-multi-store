import axios from 'axios';
import { getApiUrl } from "./utils";
export const loginUser = async (credentials) => {

  const apiUrl = new URL(getApiUrl("api-token-auth"));
  try {
    const response = await axios.post(apiUrl, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
