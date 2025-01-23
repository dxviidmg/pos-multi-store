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
  const apiUrl = new URL(getApiUrl("add-products"));

  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};


export const getStoreProductsReport = async (filter, query) => {
  const apiUrl = new URL(getApiUrl("store-product-report"));

  try {
    const response = await axios.get(apiUrl, {
      responseType: 'blob',
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getStoreProductsList = async (page = 1, pageSize = 10, searchTerm) => {
  const apiUrl = new URL(getApiUrl("store-product-list"));

  apiUrl.searchParams.append("page", page);
  apiUrl.searchParams.append("page_size", pageSize);
  if (searchTerm){
    apiUrl.searchParams.append("q", searchTerm);
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