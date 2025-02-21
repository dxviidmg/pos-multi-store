import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";

export const createTransfer = async (data) => {

  try {
  const response = await axios.post(getApiUrl("transfer"), data, {
    headers: getHeaders(),
  });
  return response;
} catch (error) {
  console.error("Error al obtener clientes:", error);
  throw error;
}
};

export const getTransfers = async () => {
    const apiUrl = new URL(getApiUrl("transfer"));
  
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };

  
  export const confirmTransfers = async (data) => {

    try {
    const response = await axios.post(getApiUrl("transfers/confirm"), data, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return error;
  }
  };


  export const confirmDistribution = async (data) => {

    try {
    const response = await axios.post(getApiUrl("store-product/distribution/confirm"), data, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return error;
  }
  };


  export const deleteTransfer = async (id) => {

    try {
    const response = await axios.delete(getApiUrl("transfer/" + id), {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return error;
  }
  };