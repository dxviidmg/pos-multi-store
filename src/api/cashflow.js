
import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";

export const getCashFlow = async (params) => {
    const apiUrl = new URL(getApiUrl("cash-flow"));
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
    console.error("Error al obtener clientes:", error);
    throw error;
  }
  };



  export const getCashFlowChoices = async () => {
    const apiUrl = new URL(getApiUrl("cash-flow/choices"));
  
    try {
    const response = await axios.get(apiUrl, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    throw error;
  }
  };


  export const createCashFlow = async (data) => {
    const apiUrl = new URL(getApiUrl("cash-flow"));
  
    try {
      const response = await axios.post(apiUrl, data, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };