import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";


export const getStoreProducts = async (params) => {
  const apiUrl = new URL(getApiUrl("store-product"));

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

export const getProducts = async (params) => {
  const apiUrl = new URL(getApiUrl("product"));
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

export const createProduct = async (data) => {
  const apiUrl = new URL(getApiUrl("product"));

  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(true),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const updateProduct = async (data) => {
  
  const apiUrl = new URL(getApiUrl("product/" + data.id));

  try {
    const response = await axios.patch(apiUrl, data, {
      headers: getHeaders(true),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const addProducts = async (data) => {
  const apiUrl = new URL(getApiUrl("products/add"));

  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getStoreProductLogs = async (params) => {
  const apiUrl = new URL(getApiUrl("store-product-logs"));

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


export const getStoreProductLogsChoices = async () => {
  const apiUrl = new URL(getApiUrl("store-product-logs/choices"));


  try {
    const response = await axios.get(apiUrl, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const updateStoreProduct = async (data) => {
  const apiUrl = new URL(getApiUrl("store-product/" + data.id));

  try {
    const response = await axios.patch(apiUrl, data, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};


export const importProductsValidation = async (data) => {
  const apiUrl = getApiUrl("products/import-validation");
  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(true),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const importProducts = async (data) => {
  const apiUrl = getApiUrl("products/import");
  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(true),
    });
    return response;
  } catch (error) {
    return error;
  }
};
