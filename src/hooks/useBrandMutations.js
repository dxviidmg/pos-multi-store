import { createMutationHooks } from '@/src/shared/hooks/useCrudMutation';
import { createBrand, updateBrand, deleteBrands } from '@/src/api/brands';

const api = {
  create: createBrand,
  update: updateBrand,
  delete: deleteBrands
};

const { useCreate, useUpdate } = createMutationHooks('Marca', 'brands', api);

export const useCreateBrand = useCreate;
export const useUpdateBrand = useUpdate;
