import { createMutationHooks } from './useCrudMutation';
import { createBrand, updateBrand, deleteBrands } from '../api/brands';

const api = {
  create: createBrand,
  update: updateBrand,
  delete: deleteBrands
};

const { useCreate, useUpdate } = createMutationHooks('Marca', 'brands', api);

export const useCreateBrand = useCreate;
export const useUpdateBrand = useUpdate;
