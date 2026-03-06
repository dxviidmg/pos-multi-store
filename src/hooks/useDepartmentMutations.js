import { createMutationHooks } from './useCrudMutation';
import * as api from '../api/departments';

const { useCreate, useUpdate } = createMutationHooks('Departamento', 'departments', api);

export const useCreateDepartment = useCreate;
export const useUpdateDepartment = useUpdate;
