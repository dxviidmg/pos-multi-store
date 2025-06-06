import axios from "axios";
import { getPrinterUrl, getUserData } from "./utils";

export const getPrint = async (endpoint, data) => {
  const printerUrl = new URL(getPrinterUrl(endpoint));
  data.cut_command = getUserData.store_printer?.cut_command

  try {
    const response = await axios.post(printerUrl, data, {});
    return response;
  } catch (error) {
    return error;
  }
};


