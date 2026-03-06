import { useQuery } from '@tanstack/react-query';
import { getInvestment } from '../api/stores';

export const useInvestment = (enabled = false, storeId = null) => {
  return useQuery({
    queryKey: ['investment', storeId],
    queryFn: () => getInvestment(storeId),
    enabled, // Solo se ejecuta cuando enabled es true
    select: (response) => {
      // Si es una tienda específica, retorna directamente el número
      if (storeId) {
        return { investment: response.data, storeId };
      }
      // Si es todas las tiendas, retorna el array
      const investments = response.data;
      const total = investments.reduce(
        (acc, store) => acc + store.investment,
        0
      );
      return { investments, total };
    },
  });
};
