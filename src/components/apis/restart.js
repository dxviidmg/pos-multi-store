import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";


export const getRedeployRender = async () => {
  const apiUrl = new URL(getApiUrl("redeploy-render"));

  try {
    const response = await axios.get(apiUrl, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};