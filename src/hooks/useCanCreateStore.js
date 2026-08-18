import { useQuery, useQueryClient } from '@tanstack/react-query';
import { canCreateStore } from '../api/stores';

const QUERY_KEY = ['canCreateStore'];

export const useCanCreateStore = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: canCreateStore,
    select: (response) => response.data,
  });

  const refetch = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

  return { ...query, refetch };
};
