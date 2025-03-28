import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";


export const getDepartments = async () => {
    const apiUrl = new URL(getApiUrl("department"));
 
    try {
      const response = await axios.get(apiUrl, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {

      if (error.response?.status === 401) {
        console.error("Unauthorized: Token expired or invalid.");
        localStorage.removeItem("user");
        window.location.href = "/";
        // Opcional: Puedes redirigir al login si es necesario
        // window.location.href = "/login";
      }
      
      return error;
    }
  };


  export const createDepartment = async (data) => {
    const apiUrl = new URL(getApiUrl("department"));
  
    try {
      const response = await axios.post(apiUrl, data, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };
  
  export const updateDepartment = async (data) => {
    const apiUrl = new URL(getApiUrl("department/" + data.id));
  
    try {
      const response = await axios.patch(apiUrl, data, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };

  export const deleteDepartments = async (data) => {
    const apiUrl = new URL(getApiUrl("departments/delete"));
  
    try {
      const response = await axios.post(apiUrl, data, {
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      return error;
    }
  };