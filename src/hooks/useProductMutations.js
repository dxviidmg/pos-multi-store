import { useCrudMutation } from './useCrudMutation';
import { createProduct, updateProduct } from '../api/products';

const productErrorParser = (error) => {
  if (error.response?.status === 400 && error.response.data?.code) {
    const codeError = error.response.data.code[0];
    if (codeError === 'product with this code already exists.') {
      return 'El código ya existe.';
    }
  }
  return 'Error desconocido. Por favor, contacte soporte.';
};

export const useCreateProduct = (options = {}) => {
  return useCrudMutation(createProduct, {
    queryKey: 'products',
    successMessage: 'Producto creado',
    errorMessage: 'Error al crear producto',
    errorParser: productErrorParser,
    ...options,
  });
};

export const useUpdateProduct = (options = {}) => {
  return useCrudMutation(updateProduct, {
    queryKey: 'products',
    successMessage: 'Producto actualizado',
    errorMessage: 'Error al actualizar producto',
    ...options,
  });
};
