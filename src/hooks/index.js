// Exportar todos los hooks para fácil importación
export { useClients } from './useClients';
export { useBrands } from './useBrands';
export { useDepartments } from './useDepartments';
export { useDiscounts } from './useDiscounts';
export { useProducts } from './useProducts';
export { useSales } from './useSales';
export { useSellers } from './useSellers';
export { useStores } from './useStores';
export { useTenantInfo } from './useTenantInfo';

// Mutations
export { useCreateClient, useUpdateClient } from './useClientMutations';
export { useCreateBrand, useUpdateBrand } from './useBrandMutations';
export { useCreateDepartment, useUpdateDepartment } from './useDepartmentMutations';
export { useCreateProduct, useUpdateProduct } from './useProductMutations';
export { useCancelSale } from './useSaleMutations';

// React Query hooks
export * from './useQueries';

// Custom hooks
export { useFetch, useFetchList, useFetchWithRetry } from './useFetch';
export { useCrudMutation, createMutationHooks } from './useCrudMutation';
export { useThemeMode } from './useThemeMode';
