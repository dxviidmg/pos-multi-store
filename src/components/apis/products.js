import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";


export const getStoreProducts = async (filter, query) => {
    const apiUrl = new URL(getApiUrl("store-product"));
    apiUrl.searchParams.append(filter, query);
  
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(true),
      });
      return response;
    } catch (error) {
      return error;
    }
  };