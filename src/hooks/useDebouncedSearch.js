import { useEffect, useRef, useState } from "react";
import { logger } from "../utils/logger";

const isAbortError = (error) => error?.name === "AbortError" || error?.name === "CanceledError";

/**
 * Búsqueda remota con debounce para autocompletados.
 *
 * Con menos de `minChars` caracteres limpia los resultados sin buscar. Cada búsqueda
 * nueva cancela la anterior (AbortController) e ignora respuestas obsoletas, así los
 * resultados nunca llegan fuera de orden. Si falla, deja la lista vacía en silencio.
 *
 * @param {string} query - Texto actual del input
 * @param {(query: string, config: { signal: AbortSignal }) => Promise<Array>} searchFn -
 *   Devuelve las opciones ya mapeadas; puede pasar `signal` a la petición
 * @param {Object} [options]
 * @param {number} [options.minChars=2] - Caracteres mínimos para buscar
 * @param {number} [options.delay=300] - Espera en ms antes de buscar
 * @returns {{ results: Array, loading: boolean }}
 */
export const useDebouncedSearch = (query, searchFn, { minChars = 2, delay = 300 } = {}) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchFnRef = useRef(searchFn);
  searchFnRef.current = searchFn;

  useEffect(() => {
    if (!query || query.length < minChars) {
      setResults([]);
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchFnRef.current(query, { signal: controller.signal });
        if (!controller.signal.aborted) setResults(data);
      } catch (error) {
        if (controller.signal.aborted || isAbortError(error)) return;
        logger.warn("Error en la búsqueda:", error?.message || error);
        setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, minChars, delay]);

  return { results, loading };
};
