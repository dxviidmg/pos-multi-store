import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";


export const getSpecialClients = async () => {
    const apiUrl = new URL(getApiUrl("special-client"));
  
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(true),
      });
      return response;
    } catch (error) {
      return error;
    }
  };