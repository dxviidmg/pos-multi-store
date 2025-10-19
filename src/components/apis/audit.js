import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";


export const getAudit = async (params) => {
    const apiUrl = new URL(getApiUrl("get-audit"));
  
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        apiUrl.searchParams.append(key, value);
      });
    }
    
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };