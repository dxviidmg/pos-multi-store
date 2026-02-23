import { useQuery } from '@tanstack/react-query';
import { getClients } from '../components/apis/clients';

export const useClients = (params = {}) => {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => getClients(params),
    select: (response) => response.data,
  });
};
