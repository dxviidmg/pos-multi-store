import { useCallback, useEffect, useRef, useState } from "react";
import { logger } from "../utils/logger";

/**
 * Lista que depende de la sucursal activa: se carga al montar y cada vez que cambia
 * de sucursal (evento `store-changed`). Un fallo se registra y deja la lista como estaba.
 * @param {Function} fetchFn - API que devuelve la respuesta de axios con la lista en `data`
 * @param {string} errorMessage - Texto para el log cuando falla la carga
 * @returns {{ items: Array, refresh: Function }}
 */
export const useStoreScopedList = (fetchFn, errorMessage) => {
  const [items, setItems] = useState([]);
  const activeRef = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await fetchFn();
      if (activeRef.current) setItems(data);
    } catch (error) {
      logger.error(errorMessage, error);
    }
  }, [fetchFn, errorMessage]);

  useEffect(() => {
    activeRef.current = true;
    refresh();
    window.addEventListener("store-changed", refresh);
    return () => {
      activeRef.current = false;
      window.removeEventListener("store-changed", refresh);
    };
  }, [refresh]);

  return { items, refresh };
};
