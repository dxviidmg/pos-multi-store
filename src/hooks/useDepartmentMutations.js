import { createMutationHooks } from '@/src/shared/hooks/useCrudMutation';
import { createDepartment, updateDepartment, deleteDepartments } from '@/src/api/departments';

const api = {
  create: createDepartment,
  update: updateDepartment,
  delete: deleteDepartments
};

const { useCreate, useUpdate } = createMutationHooks('Departamento', 'departments', api);

export const useCreateDepartment = useCreate;
export const useUpdateDepartment = useUpdate;
