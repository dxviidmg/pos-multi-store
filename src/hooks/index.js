// Exportar todos los hooks para fácil importación
export { useClients } from '@/src/hooks/useClients';
export { useBrands } from '@/src/features/catalog/hooks/useBrands';
export { useDepartments } from '@/src/features/catalog/hooks/useDepartments';
export { useDiscounts } from '@/src/hooks/useDiscounts';
export { useProducts } from '@/src/hooks/useProducts';
export { useSales } from '@/src/hooks/useSales';
export { useSellers } from '@/src/features/catalog/hooks/useSellers';
export { useStores } from '@/src/hooks/useStores';
export { useTenantInfo } from '@/src/hooks/useTenantInfo';

// Mutations
export { useCreateClient, useUpdateClient } from '@/src/hooks/useClientMutations';
export { useCreateBrand, useUpdateBrand } from '@/src/features/catalog/hooks/useBrandMutations';
export { useCreateDepartment, useUpdateDepartment } from '@/src/features/catalog/hooks/useDepartmentMutations';
export { useCreateProduct, useUpdateProduct } from '@/src/hooks/useProductMutations';
export { useCancelSale } from '@/src/hooks/useSaleMutations';

// React Query hooks
export * from '@/src/hooks/useTransfers';

// Custom hooks
export { useFetch, useFetchList, useFetchWithRetry } from '@/src/shared/hooks/useFetch';
export { useCrudMutation, createMutationHooks } from '@/src/shared/hooks/useCrudMutation';
export { useThemeMode } from '@/src/shared/hooks/useThemeMode';
