import axios from "axios";
import { getPrinterUrl, getUserData, getApiUrl } from "./utils";

export const getPrint = async (endpoint, data) => {
  const printerUrl = new URL(getPrinterUrl(endpoint));
  const user = getUserData()
  data.token = user.token
  data.api_url = getApiUrl('store-printer')
  data.store_printer = user.store_printer

  
  
  try {
    const response = await axios.post(printerUrl, data, {});
    return response;
  } catch (error) {
    return error;
  }
};


