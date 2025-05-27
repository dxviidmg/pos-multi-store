import axios from "axios";
import { getPrinterUrl, getUserData } from "./utils";

export const getPrint = async (endpoint, data) => {
  const printerUrl = new URL(getPrinterUrl(endpoint));
  console.log(getUserData.printer)

  try {
    const response = await axios.post(printerUrl, data, {});
    return response;
  } catch (error) {
    return error;
  }
};


