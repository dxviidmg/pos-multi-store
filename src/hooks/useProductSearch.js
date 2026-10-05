import { useCallback, useRef, useState } from "react";
import { useFetchWithRetry } from "./useFetch";
import { getStoreProducts } from "../api/products";
import { showError, showWarning, showConfirm } from "../utils/alerts";
import { colors } from "../theme/colors";
import { QUERY_TYPES } from "../constants";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { readJSON, writeJSON } from "../utils/storage";

const MAX_SLOW_CODES = 50;

const logSearchTiming = (ms, queryCode) => {
  const stored = readJSON(STORAGE_KEYS.SEARCH_TIMING_STATS);
  const tiempos = stored?.tiempos && typeof stored.tiempos === "object" ? stored.tiempos : {};
  let slow = Array.isArray(stored?.mas_de_8s) ? stored.mas_de_8s : [];
  const bucket = ms <= 500 ? 0 : Math.ceil((ms - 500) / 1000);
  tiempos[bucket] = (tiempos[bucket] || 0) + 1;
  if (ms > 8000) slow = [...slow, queryCode];
  writeJSON(STORAGE_KEYS.SEARCH_TIMING_STATS, { tiempos, mas_de_8s: slow.slice(-MAX_SLOW_CODES) });
};

export const useProductSearch = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [queryType, setQueryType] = useState(QUERY_TYPES.CODE);
  const [searching, setSearching] = useState(false);
  const searchingRef = useRef(false);

  const { refetch: fetchWithRetry } = useFetchWithRetry(
    (params, config) => getStoreProducts(params, config),
    { maxRetries: 1, timeout: 8000 }
  );

  const fetchData = useCallback(
    async (handleSingleProductFetch, createProductsOnSale, productModal) => {
      // El modo "visual" busca igual que "q" (por marca o nombre)
      const isTextMode = queryType === QUERY_TYPES.NAME || queryType === QUERY_TYPES.VISUAL;
      if (!query || isTextMode) {
        setData([]);
        return;
      }

      if (searchingRef.current) return;
      searchingRef.current = true;
      setSearching(true);

      const startTime = performance.now();

      try {
        const fetchedData = await fetchWithRetry({ [queryType]: query });
        const elapsed = Math.round(performance.now() - startTime);

        searchingRef.current = false;
        setSearching(false);

        logSearchTiming(elapsed, query);

        if (!fetchedData) {
          showError("Error al buscar el producto", "La búsqueda tardó demasiado. Intenta de nuevo o búscalo por nombre.");
          return;
        }

        if (fetchedData.length === 0) {
          if (createProductsOnSale) {
            const confirmed = await showConfirm(
              "Producto no encontrado",
              `No se encontró ningún producto con el código "${query}". ¿Desea crear uno nuevo con este código?`,
              { confirmText: "Sí, crear producto", cancelText: "No, gracias", confirmColor: colors.primary, icon: "question" }
            );
            if (confirmed) {
              productModal.open({ code: query, createFromSearch: true });
            } else {
              // Si cancela, limpiar la búsqueda para evitar que se re-abra el diálogo
              setQuery("");
            }
          } else {
            showWarning("No se encontró el producto", `No hay ningún producto con el código "${query}".`);
          }
        } else if (fetchedData.length === 1) {
          handleSingleProductFetch(fetchedData[0]);
        } else {
          setData(fetchedData);
        }
      } catch {
        searchingRef.current = false;
        setSearching(false);
      }
    },
    [query, queryType, fetchWithRetry]
  );

  return {
    query,
    setQuery,
    data,
    setData,
    queryType,
    setQueryType,
    searching,
    fetchData,
  };
};
