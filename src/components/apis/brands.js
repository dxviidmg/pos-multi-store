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


  export const createBrand = async (data) => {
    const apiUrl = new URL(getApiUrl("brand"));
  
    try {
      const response = await axios.post(apiUrl, data, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };
  
  export const updateBrand = async (data) => {
    const apiUrl = new URL(getApiUrl("brand/" + data.id));
  
    try {
      const response = await axios.patch(apiUrl, data, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };