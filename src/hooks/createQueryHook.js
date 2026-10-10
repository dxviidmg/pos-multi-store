import { useQuery } from '@tanstack/react-query';

/**
 * Crea un hook de lectura con React Query que devuelve `response.data`.
 * @param {string} key - Raíz del query key (también la usan las mutaciones para invalidar)
 * @param {Function} fetchFn - Función de API que recibe `params` y devuelve la respuesta de axios
 * @returns {(params?: Object) => import('@tanstack/react-query').UseQueryResult}
 */
export const createQueryHook = (key, fetchFn) => {
  const useQueryHook = (params) =>
    useQuery({
      queryKey: params ? [key, params] : [key],
      queryFn: () => fetchFn(params),
      select: (response) => response.data,
    });
  return useQueryHook;
};
