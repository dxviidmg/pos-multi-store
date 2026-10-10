import { useQuery } from '@tanstack/react-query';
import { getStores, getStoresCashSummary } from '../api/stores';
import { createQueryHook } from './createQueryHook';

export const useStores = createQueryHook('stores', getStoresCashSummary);

/**
 * Lista de sucursales para selects y filtros (cacheada por React Query).
 * @param {Object} [params] - Filtros opcionales para getStores
 * @returns {{ data: Array, isLoading: boolean }}
 */
export const useStoreOptions = (params) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['stores', 'options', params],
    queryFn: () => getStores(params),
    select: (response) => response.data,
  });
  return { data, isLoading };
};
