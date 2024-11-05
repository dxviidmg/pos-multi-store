import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";

export const createTransfer = async (data) => {

  try {
  const response = await axios.post(getApiUrl("product-transfer"), data, {
    headers: getHeaders(),
  });
  return response;
} catch (error) {
  console.error("Error al obtener clientes:", error);
  throw error;
}
};

export const getTransfers = async () => {
    const apiUrl = new URL(getApiUrl("product-transfer"));
  
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };

  
  export const confirmTransfer = async (data) => {

    try {
    const response = await axios.post(getApiUrl("confirm-transfer"), data, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return error;
  }
  };