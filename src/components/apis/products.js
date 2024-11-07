import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";


export const getStoreProducts = async (filter, query) => {
    const apiUrl = new URL(getApiUrl("store-product"));
    apiUrl.searchParams.append(filter, query);
  
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };


  export const getProducts = async (filter, query) => {
    const apiUrl = new URL(getApiUrl("product"));
    apiUrl.searchParams.append(filter, query);
  
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };


  export const createProduct = async (data) => {
    const apiUrl = new URL(getApiUrl("product"));

  
    try {
      const response = await axios.post(apiUrl, data, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };



