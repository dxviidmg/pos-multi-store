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



  export const createTransfer = async (data) => {

    try {
    const response = await axios.post(getApiUrl("product-transfer"), data, {
      headers: getHeaders(),
    });
    return response; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    throw error; // Puedes manejar el error según tus necesidades
  }
};