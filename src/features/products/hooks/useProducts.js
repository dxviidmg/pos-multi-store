import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/src/features/products/api/products';

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    select: (response) => response.data,
  });
};
