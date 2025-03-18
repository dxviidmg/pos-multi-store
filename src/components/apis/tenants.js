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




  export const getTenantInfo = async () => {
    const apiUrl = getApiUrl("tenant-info")
  
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };