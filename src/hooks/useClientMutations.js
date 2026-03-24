import { createMutationHooks, useCrudMutation } from './useCrudMutation';
import { createClient, updateClient, deleteClient } from '../api/clients';

const api = {
  create: createClient,
  update: updateClient,
  delete: deleteClient
};

const { useUpdate } = createMutationHooks('Cliente', 'clients', api);

// Parser personalizado para errores de cliente
const clientErrorParser = (error) => {
  if (error.response?.status === 400 && error.response.data.phone_number) {
    const phoneError = error.response.data.phone_number[0];
    if (phoneError === 'Ensure this field has at least 10 characters.') {
      return 'El teléfono debe tener al menos 10 dígitos.';
    }
    if (phoneError === 'client with this phone number already exists.') {
      return 'El teléfono ya existe.';
    }
  }
  return 'Error desconocido. Por favor, contacte soporte.';
};

export const useCreateClient = (options = {}) => {
  return useCrudMutation(createClient, {
    queryKey: 'clients',
    successMessage: 'Cliente creado',
    errorMessage: 'Error al guardar cliente',
    errorParser: clientErrorParser,
    ...options,
  });
};

export const useUpdateClient = useUpdate;
