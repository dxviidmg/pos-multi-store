import { useQuery } from '@tanstack/react-query';
import { getBrands } from '../api/brands';
import { getDepartments } from '../api/departments';
import { getProducts } from '../api/products';
import { getSellers } from '../api/sellers';
import { getStores } from '../api/stores';
import { getClients } from '../api/clients';
import { getSales } from '../api/sales';
import { getTransfers } from '../api/transfers';
import { createApiService } from '../api/apiFactory';
import { createMutationHooks } from './useCrudMutation';

// Brands
export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await getBrands();
      return response.data;
    }
  });
};

const brandApi = createApiService('brand');
export const { useCreate: useCreateBrand, useUpdate: useUpdateBrand } = createMutationHooks('Marca', 'brands', brandApi);

// Departments
export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await getDepartments();
      return response.data;
    }
  });
};

const departmentApi = createApiService('department');
export const { useCreate: useCreateDepartment, useUpdate: useUpdateDepartment } = createMutationHooks('Departamento', 'departments', departmentApi);

// Products
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await getProducts(params);
      return response.data;
    }
  });
};

// Sellers
export const useSellers = () => {
  return useQuery({
    queryKey: ['sellers'],
    queryFn: async () => {
      const response = await getSellers();
      return response.data;
    }
  });
};

// Stores
export const useStores = () => {
  return useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const response = await getStores();
      return response.data;
    }
  });
};

// Clients
export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await getClients();
      return response.data;
    }
  });
};

// Sales
export const useSales = () => {
  return useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const response = await getSales();
      return response.data;
    }
  });
};

// Transfers
export const useTransfers = () => {
  return useQuery({
    queryKey: ['transfers'],
    queryFn: async () => {
      const response = await getTransfers();
      return response.data;
    }
  });
};

const transferApi = createApiService('transfer');
export const { useDelete: useDeleteTransfer } = createMutationHooks('Traspaso', 'transfers', transferApi);
