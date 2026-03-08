import { createMutationHooks } from './useCrudMutation';
import { createDepartment, updateDepartment, deleteDepartments } from '../api/departments';

const api = {
  create: createDepartment,
  update: updateDepartment,
  delete: deleteDepartments
};

const { useCreate, useUpdate } = createMutationHooks('Departamento', 'departments', api);

export const useCreateDepartment = useCreate;
export const useUpdateDepartment = useUpdate;
