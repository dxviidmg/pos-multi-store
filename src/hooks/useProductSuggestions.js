import { useEffect, useRef, useState } from "react";
import { getStoreProductSuggestions } from "../api/products";
import { logger } from "../utils/logger";

const MIN_CHARS = 3;
const DEBOUNCE_MS = 300;
const MAX_SUGGESTIONS = 5;

/**
 * Hook para el desplegable de sugerencias tipo autocompletado del modo "Nombre o marca".
 *
 * Solo actúa cuando `enabled` es true (queryType === "q") y el texto tiene al menos 3
 * caracteres. Aplica debounce de 300ms y cancela peticiones obsoletas con AbortController
 * para evitar resultados fuera de orden.
 *
 * @param {Object} args
 * @param {string} args.query - Texto actual del input
 * @param {string} args.queryType - Modo de búsqueda activo
 * @param {boolean} args.enabled - Si el modo actual habilita sugerencias
 * @returns {{ suggestions: Array, loading: boolean, open: boolean, setOpen: Function, noResults: boolean }}
 */
export const useProductSuggestions = ({ query, queryType, enabled }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const abortRef = useRef(null);

  useEffect(() => {
    const trimmed = (query || "").trim();

    // Condiciones para NO buscar: modo no habilitado, tipo distinto de "q" o texto corto.
    if (!enabled || queryType !== "q" || trimmed.length < MIN_CHARS) {
      if (abortRef.current) abortRef.current.abort();
      setSuggestions([]);
      setNoResults(false);
      setLoading(false);
      setOpen(false);
      return;
    }

    setLoading(true);
    setOpen(true);
    setNoResults(false);

    const timer = setTimeout(async () => {
      // Cancelar cualquier petición previa en vuelo.
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await getStoreProductSuggestions(trimmed, {
          signal: controller.signal,
        });
        const data = Array.isArray(response?.data) ? response.data : [];
        const limited = data.slice(0, MAX_SUGGESTIONS);

        setSuggestions(limited);
        setNoResults(limited.length === 0);
        setLoading(false);
      } catch (err) {
        // Peticiones canceladas: ignorar sin cambiar estado.
        if (err.name === "AbortError" || err.name === "CanceledError") return;
        // Error de red/timeout: cerrar el desplegable en silencio (es una ayuda, no bloqueante).
        logger.warn("Error obteniendo sugerencias:", err?.message || err);
        setSuggestions([]);
        setNoResults(false);
        setLoading(false);
        setOpen(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, queryType, enabled]);

  // Limpieza al desmontar.
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return { suggestions, loading, open, setOpen, noResults };
};
