import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";

export const getPayments = async () => {
    const apiUrl = new URL(getApiUrl("payment"));
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };




  export const getTenantNotices = async () => {
    const apiUrl = getApiUrl("tenant-notices")
  
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };