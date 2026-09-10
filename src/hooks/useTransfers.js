import { useQuery } from '@tanstack/react-query';
import { getTransfers } from '@/src/api/transfers';
import { createApiService } from '@/src/api/apiFactory';
import { createMutationHooks } from '@/src/hooks/useCrudMutation';

// Transfers
export const useTransfers = (params = {}) => {
  return useQuery({
    queryKey: ['transfers', params],
    queryFn: async () => {
      const response = await getTransfers(params);
      return response.data;
    }
  });
};

const transferApi = createApiService('transfer');
export const { useDelete: useDeleteTransfer } = createMutationHooks('Traspaso', 'transfers', transferApi);
