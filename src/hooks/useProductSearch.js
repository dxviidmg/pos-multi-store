import { useCallback, useRef, useState } from "react";
import { useFetchWithRetry } from "./useFetch";
import { getStoreProducts } from "../api/products";
import { showError } from "../utils/alerts";
import Swal from "sweetalert2";

export const useProductSearch = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [queryType, setQueryType] = useState("code");
  const [searching, setSearching] = useState(false);
  const searchingRef = useRef(false);

  const { refetch: fetchWithRetry } = useFetchWithRetry(
    (params, config) => getStoreProducts(params, config),
    { maxRetries: 1, timeout: 8000 }
  );

  const logSearchTiming = (ms, queryCode, productName) => {
    const stats = JSON.parse(localStorage.getItem("search_timing_stats") || '{"tiempos":{},"mas_de_8s":[]}');
    const bucket = ms <= 500 ? 0 : Math.ceil((ms - 500) / 1000);
    stats.tiempos[bucket] = (stats.tiempos[bucket] || 0) + 1;
    if (ms > 8000) stats.mas_de_8s.push(queryCode);
    localStorage.setItem("search_timing_stats", JSON.stringify(stats));
  };

  const fetchData = useCallback(
    async (handleSingleProductFetch, createProductsOnSale, productModal) => {
      if (!query || queryType === "q") {
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

        const productName = fetchedData?.[0]?.product?.name || null;
        logSearchTiming(elapsed, query, productName);

        if (!fetchedData) {
          showError("Búsqueda tardada", "La búsqueda tardó demasiado. Reintentar o buscar de manera manual");
          return;
        }

        if (fetchedData.length === 0) {
          if (createProductsOnSale) {
            const confirm = await Swal.fire({
              icon: "question",
              title: "Producto no encontrado",
              text: `No se encontró ningún producto con el código "${query}". ¿Desea crear uno nuevo con este código?`,
              showCancelButton: true,
              confirmButtonText: "Sí, crear producto",
              cancelButtonText: "No, gracias",
              confirmButtonColor: "#04346b",
            });
            if (confirm.isConfirmed) {
              productModal.open({ code: query, createFromSearch: true });
            }
          } else {
            showError("Producto no encontrado", `No se encontró ningún producto con el código "${query}"`);
          }
        } else if (fetchedData.length === 1) {
          handleSingleProductFetch(fetchedData[0]);
        } else {
          setData(fetchedData);
        }
      } catch (err) {
        searchingRef.current = false;
        if (err.name === "AbortError" || err.name === "CanceledError") return;
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
