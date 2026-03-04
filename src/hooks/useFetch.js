import { useState, useEffect } from 'react';

/**
 * Hook personalizado para hacer fetch de datos
 * @param {Function} fetchFn - Función que retorna una promesa con los datos
 * @param {Array} deps - Dependencias para re-ejecutar el fetch
 * @returns {Object} { data, loading, error, refetch }
 */
export const useFetch = (fetchFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFn();
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook para fetch de listas (arrays)
 * Inicializa data como array vacío en lugar de null
 */
export const useFetchList = (fetchFn, deps = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFn();
      setData(response.data || []);
    } catch (err) {
      setError(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: fetchData };
};
