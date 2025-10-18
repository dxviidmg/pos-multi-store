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

export const getSales = async (params) => {
  const apiUrl = new URL(getApiUrl("sale"));

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

export const getSale = async (id) => {
  const apiUrl = new URL(getApiUrl("sale/" + id));

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

export const getCashSummary = async (date) => {
  const apiUrl = new URL(getApiUrl("cash/summary"));
  if (date) {
    apiUrl.searchParams.append("date", date);
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
  const apiUrl = getApiUrl("sales/import-validation");
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
  const apiUrl = getApiUrl("sales/import");
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
  const apiUrl = getApiUrl("sales/cancel");
  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};


export const updateSale = async (data) => {
  const apiUrl = new URL(getApiUrl("sale/" + data.id));

  try {
    const response = await axios.patch(apiUrl, data, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};


export const getSalesAsync = async (params) => {
  const apiUrl = new URL(getApiUrl("async-sale"));

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
    return error;
  }
};