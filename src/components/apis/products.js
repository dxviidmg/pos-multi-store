import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";


export const getStoreProducts = async (filter, query) => {
  const apiUrl = new URL(getApiUrl("store-product"));

  if (filter){
    apiUrl.searchParams.append(filter, query);
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

export const getProducts = async (filter, query) => {
  const apiUrl = new URL(getApiUrl("product"));
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

export const createProduct = async (data) => {
  const apiUrl = new URL(getApiUrl("product"));

  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(),
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
      headers: getHeaders(),
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

export const getStoreProductLogs = async (storeProductId) => {
  const apiUrl = new URL(getApiUrl("store-product-logs"));

  if (storeProductId){
    apiUrl.searchParams.append("?store-product-id=", storeProductId);
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
