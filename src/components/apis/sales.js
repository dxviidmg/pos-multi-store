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


export const getSales = async (date) => {

  const apiUrl = new URL(getApiUrl("sale"));
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


export const getDailyEarnings = async (date) => {
  const apiUrl = new URL(getApiUrl("daily-earnings"));
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

export const importSalesValidation = async (data) => {
  const apiUrl = getApiUrl("import-sales-validation");
  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(true),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const importSales = async (data) => {
  const apiUrl = getApiUrl("import-sales");
  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(true),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const cancelSale = async (data) => {
  const apiUrl = getApiUrl("cancel-sale");
  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(true),
    });
    return response;
  } catch (error) {
    return error;
  }
};