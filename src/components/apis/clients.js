import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";

export const getClients = async (params) => {
  const apiUrl = new URL(getApiUrl("client"));

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      apiUrl.searchParams.append(key, value);
    });
  }

  console.log('apiUrl', apiUrl)
  try {
    const response = await axios.get(apiUrl, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const createClient = async (data) => {
  const apiUrl = new URL(getApiUrl("client"));

  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const updateClient = async (data) => {
  const apiUrl = new URL(getApiUrl("client/" + data.id));

  try {
    const response = await axios.patch(apiUrl, data, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};
