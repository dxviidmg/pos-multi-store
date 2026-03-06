import { createMutationHooks } from './useCrudMutation';
import * as api from '../api/brands';

const { useCreate, useUpdate } = createMutationHooks('Marca', 'brands', api);

export const useCreateBrand = useCreate;
export const useUpdateBrand = useUpdate;
