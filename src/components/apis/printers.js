import axios from "axios";
import { getPrinterUrl, getUserData } from "./utils";

export const getPrint = async (endpoint, data) => {
  const printerUrl = new URL(getPrinterUrl(endpoint));
  const user = getUserData()
  data.token = user.token
  
  try {
    const response = await axios.post(printerUrl, data, {});
    return response;
  } catch (error) {
    return error;
  }
};


