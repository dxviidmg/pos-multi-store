import { useCallback, useRef, useState } from "react";
import { showRequestError } from "../../../utils/alerts";

/**
 * Lista que se carga bajo demanda con un objeto de filtros (`params`).
 * Ignora respuestas viejas si se lanzó otra búsqueda antes de que terminaran.
 *
 * @param {Function} fetchFn - Función de API que recibe `params` y devuelve la respuesta de axios
 * @param {Object} initialParams - Filtros iniciales
 * @param {string} errorAction - Acción para `showRequestError` (p. ej. "cargar los productos")
 */
export const useFilteredList = (fetchFn, initialParams, errorAction) => {
  const [items, setItems] = useState([]);
  const [params, setParams] = useState(initialParams);
  const [loading, setLoading] = useState(false);
  const requestRef = useRef(0);

  const fetchItems = useCallback(async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    try {
      const response = await fetchFn(params);
      if (requestId === requestRef.current) setItems(response.data);
    } catch (error) {
      if (requestId === requestRef.current) showRequestError(errorAction, error);
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, [fetchFn, params, errorAction]);

  return { items, setItems, params, setParams, loading, fetchItems };
};
