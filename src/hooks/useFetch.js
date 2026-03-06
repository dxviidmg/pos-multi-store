import { useState, useEffect, useCallback } from 'react';
import { logger } from '../utils/logger';

/**
 * Hook unificado para fetch con soporte de reintentos y timeout
 * @param {Function} fetchFn - Función que retorna una promesa
 * @param {Object} options - Opciones de configuración
 * @param {Array} options.deps - Dependencias para re-ejecutar
 * @param {*} options.initialData - Valor inicial de data
 * @param {number} options.maxRetries - Reintentos máximos (0 = sin reintentos)
 * @param {number} options.timeout - Timeout en ms
 * @param {boolean} options.enabled - Si debe ejecutarse automáticamente
 * @returns {Object} { data, loading, error, refetch }
 */
export const useFetch = (fetchFn, options = {}) => {
  const {
    deps = [],
    initialData = null,
    maxRetries = 0,
    timeout = 3000,
    enabled = true,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    let attempts = 0;
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    while (attempts <= maxRetries) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetchFn(params, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (maxRetries > 0) {
          logger.log(`✅ Petición exitosa en intento ${attempts + 1}`);
        }
        
        setData(response.data);
        setLoading(false);
        return response.data;

      } catch (err) {
        clearTimeout(timeoutId);

        if ((err.name === "CanceledError" || err.name === "AbortError") && attempts < maxRetries) {
          logger.warn(`⏱️ Intento ${attempts + 1}: Timeout después de ${timeout}ms`);
          attempts++;
          await delay(1000);
        } else {
          if (attempts >= maxRetries && maxRetries > 0) {
            logger.error(`❌ Máximo de reintentos alcanzado (${maxRetries})`);
          }
          setError(err);
          setData(initialData);
          setLoading(false);
          return initialData;
        }
      }
    }
  }, [fetchFn, initialData, maxRetries, timeout]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook para fetch de listas (arrays)
 * Alias de useFetch con initialData = []
 */
export const useFetchList = (fetchFn, options = {}) => {
  return useFetch(fetchFn, { ...options, initialData: [] });
};

/**
 * Hook para fetch con reintentos
 * Alias de useFetch con maxRetries configurado
 */
export const useFetchWithRetry = (fetchFn, options = {}) => {
  return useFetch(fetchFn, { 
    ...options, 
    maxRetries: options.maxRetries ?? 2,
    enabled: false, // No ejecutar automáticamente
  });
};
