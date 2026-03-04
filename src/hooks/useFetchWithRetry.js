import { useCallback } from 'react';
import { logger } from '../utils/logger';

/**
 * Hook para realizar peticiones con reintentos automáticos y timeout
 * 
 * @param {number} maxRetries - Número máximo de reintentos (default: 2)
 * @param {number} timeout - Timeout en milisegundos (default: 3000)
 * @returns {Object} - { fetchWithRetry }
 * 
 * @example
 * const { fetchWithRetry } = useFetchWithRetry(2, 3000);
 * const data = await fetchWithRetry(getStoreProducts, { code: '123' });
 */
export const useFetchWithRetry = (maxRetries = 2, timeout = 3000) => {
  const fetchWithRetry = useCallback(async (fetchFn, params = {}) => {
    let attempts = 0;
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    while (attempts <= maxRetries) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetchFn(params, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        logger.log(`✅ Petición exitosa en intento ${attempts + 1}`);
        return response.data;

      } catch (err) {
        clearTimeout(timeoutId);

        if (err.name === "CanceledError" || err.name === "AbortError") {
          logger.warn(`⏱️ Intento ${attempts + 1}: Timeout después de ${timeout}ms`);
          attempts++;

          if (attempts > maxRetries) {
            logger.error(`❌ Máximo de reintentos alcanzado (${maxRetries})`);
            return null;
          }

          // Esperar antes de reintentar
          await delay(1000);
        } else {
          // Otro tipo de error, no reintentar
          logger.error('❌ Error en petición:', err);
          throw err;
        }
      }
    }

    return null;
  }, [maxRetries, timeout]);

  return { fetchWithRetry };
};
