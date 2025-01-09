import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";


export const getClients = async (query) => {
    const apiUrl = new URL(getApiUrl("client"));

    if (query){
      apiUrl.searchParams.append('q', query);

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


  export const createClient = async (data) => {
    const apiUrl = new URL(getApiUrl("client"));

  
    try {
      const response = await axios.post(apiUrl, data, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      console.log(error)
      return error;
    }
  };

  export const updateClient = async (data) => {
    const apiUrl = new URL(getApiUrl("client/"+data.id));

  
    try {
      const response = await axios.patch(apiUrl, data, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };