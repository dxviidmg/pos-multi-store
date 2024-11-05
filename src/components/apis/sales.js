import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";


export const createSale = async (data) => {

    try {
    const response = await axios.post(getApiUrl("sale"), data, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    throw error;
  }
};


export const getSales = async () => {

  try {
  const response = await axios.get(getApiUrl("sale"), {
    headers: getHeaders(),
  });
  return response;
} catch (error) {
  console.error("Error al obtener clientes:", error);
  throw error;
}
};


export const getDailyEarnings = async () => {

  try {
  const response = await axios.get(getApiUrl("daily-earnings"), {
    headers: getHeaders(),
  });
  return response;
} catch (error) {
  console.error("Error al obtener clientes:", error);
  throw error;
}
};
