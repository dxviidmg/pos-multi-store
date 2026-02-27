import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBrands, createBrand, updateBrand, deleteBrands } from '../api/brands';
import { getDepartments, createDepartment, updateDepartment, deleteDepartments } from '../api/departments';
import { getProducts, deleteProducts } from '../api/products';
import { getSellers } from '../api/sellers';
import { getStores } from '../api/stores';
import { getClients } from '../api/clients';
import { getSales } from '../api/sales';
import { getTransfers, deleteTransfer } from '../api/transfers';

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

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    }
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    }
  });
};

export const useDeleteBrands = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBrands,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    }
  });
};

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

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    }
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    }
  });
};

export const useDeleteDepartments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    }
  });
};

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

export const useDeleteProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
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

export const useDeleteTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
    }
  });
};
