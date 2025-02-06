import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";

export const getCashFlow = async (date) => {
    const apiUrl = new URL(getApiUrl("cash-flow"));
    if (date){
      apiUrl.searchParams.append('date', date);
  
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