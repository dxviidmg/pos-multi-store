import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";


export const getBrands = async () => {
    const apiUrl = new URL(getApiUrl("brand"));
 
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };