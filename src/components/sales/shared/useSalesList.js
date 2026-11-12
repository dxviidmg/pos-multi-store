import { useEffect, useState } from "react";
import { getSales } from "../../../api/sales";
import { showRequestError } from "../../../utils/alerts";

/**
 * Ventas (o apartados) que cumplen los filtros `params`: se vuelven a pedir cuando cambian
 * y se descarta la respuesta de una consulta vieja. `setSales` permite actualizar una fila sin recargar.
 * @param {Object} params - Filtros de `getSales`
 * @param {string} errorAction - Acción para el aviso de error, por ejemplo "cargar las ventas"
 */
export const useSalesList = (params, errorAction) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    const fetchSales = async () => {
      setLoading(true);
      try {
        const response = await getSales(params);
        if (!ignore) setSales(response.data);
      } catch (error) {
        if (!ignore) showRequestError(errorAction, error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchSales();
    return () => { ignore = true; };
  }, [params, errorAction]);

  return { sales, setSales, loading };
};
