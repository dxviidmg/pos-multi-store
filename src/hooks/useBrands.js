import { useQuery } from '@tanstack/react-query';
import { getBrands } from '../api/brands';

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
    select: (response) => response.data,
  });
};
