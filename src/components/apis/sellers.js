import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";


export const getSellers = async () => {
    const apiUrl = new URL(getApiUrl("store-worker"));
 
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };


  export const createSeller = async (data) => {
    const apiUrl = new URL(getApiUrl("store-worker"));
 
    try {
      const response = await axios.post(apiUrl, data, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };