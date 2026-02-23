import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../components/apis/products';

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    select: (response) => response.data,
  });
};
