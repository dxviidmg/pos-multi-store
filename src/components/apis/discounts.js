import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";


export const getDiscounts = async () => {
    const apiUrl = new URL(getApiUrl("discount"));
 
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };