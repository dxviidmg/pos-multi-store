import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";

export const getStores = async (params) => {
  console.log(params)
    const apiUrl = new URL(getApiUrl("store"));
  
    if (params && Object.keys(params).length > 0) {
      Object.keys(params).forEach((key) =>
        apiUrl.searchParams.append(key, params[key])
      );
    }

    console.log('apiUrl', apiUrl)
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };


  export const getStoreInvestment = async (store) => {
    const apiUrl = new URL(getApiUrl("store/investments/" + store.id));
  
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };

  export const getInvestment = async () => {
    const apiUrl = new URL(getApiUrl("investments"));
  
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };