import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";


export const getAudit = async (params) => {
    const apiUrl = new URL(getApiUrl("audit1"));
  
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

  export const getAudit2 = async (params) => {
    const apiUrl = new URL(getApiUrl("audit2"));
  
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