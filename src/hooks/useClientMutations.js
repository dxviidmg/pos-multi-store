import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient, updateClient } from '../api/clients';
import { showSuccess, showError } from '../utils/alerts';

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      showSuccess('Cliente creado');
    },
    onError: (error) => {
      let message = 'Error desconocido. Por favor, contacte soporte.';
      
      if (error.response?.status === 400 && error.response.data.phone_number) {
        const phoneError = error.response.data.phone_number[0];
        if (phoneError === 'Ensure this field has at least 10 characters.') {
          message = 'El teléfono debe tener al menos 10 dígitos.';
        } else if (phoneError === 'client with this phone number already exists.') {
          message = 'El teléfono ya existe.';
        }
      }

      showError('Error al guardar cliente', message);
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      showSuccess('Cliente actualizado');
    },
    onError: () => {
      showError('Error al actualizar cliente');
    },
  });
};
