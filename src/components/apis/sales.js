import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";


export const createSale = async (data) => {

    try {
    const response = await axios.post(getApiUrl("sale"), data, {
      headers: getHeaders(),
    });
    return response; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    throw error; // Puedes manejar el error según tus necesidades
  }
};
