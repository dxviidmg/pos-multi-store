import { createMutationHooks } from './useCrudMutation';
import { createBrand, updateBrand } from '../api/brands';
import { createDepartment, updateDepartment } from '../api/departments';

// Solo crear y actualizar: el borrado múltiple lo hace CatalogList con el `deleteFn` que recibe (deleteBrands / deleteDepartments).
const brandHooks = createMutationHooks('Marca', 'brands', { create: createBrand, update: updateBrand }, { feminine: true });
const departmentHooks = createMutationHooks('Departamento', 'departments', { create: createDepartment, update: updateDepartment });

export const useCreateBrand = brandHooks.useCreate;
export const useUpdateBrand = brandHooks.useUpdate;
export const useCreateDepartment = departmentHooks.useCreate;
export const useUpdateDepartment = departmentHooks.useUpdate;
