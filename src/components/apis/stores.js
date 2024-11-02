import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";

export const getStores = async () => {
    const apiUrl = new URL(getApiUrl("store"));
  
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };