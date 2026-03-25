import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showSuccess, showError } from '../utils/alerts';

/**
 * Hook genérico para crear mutaciones CRUD
 * @param {Function} mutationFn - Función de mutación (create, update, delete)
 * @param {Object} options - Opciones de configuración
 * @param {string|Array} options.queryKey - Query key a invalidar
 * @param {string} options.successMessage - Mensaje de éxito
 * @param {string} options.errorMessage - Mensaje de error
 * @param {Function} options.onSuccess - Callback adicional de éxito
 * @param {Function} options.onError - Callback adicional de error
 * @param {Function} options.errorParser - Función para parsear errores del servidor
 * @returns {Object} Mutation object de React Query
 */
export const useCrudMutation = (mutationFn, options = {}) => {
  const {
    queryKey,
    successMessage,
    errorMessage = 'Error en la operación',
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    errorParser,
  } = options;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      if (queryKey) {
        const keys = Array.isArray(queryKey) ? queryKey : [queryKey];
        keys.forEach(key => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      
      if (successMessage) {
        showSuccess(successMessage);
      }
      
      const dynamicMessage = onSuccessCallback?.(data, variables, context);
      if (dynamicMessage && !successMessage) {
        showSuccess(dynamicMessage);
      }
    },
    onError: (error, variables, context) => {
      let message = errorMessage;
      
      if (errorParser) {
        message = errorParser(error) || errorMessage;
      }
      
      showError('Error', message);
      onErrorCallback?.(error, variables, context);
    },
  });
};

/**
 * Factory para crear hooks de mutación para un recurso
 * @param {string} resource - Nombre del recurso (singular)
 * @param {string} resourcePlural - Nombre del recurso (plural) para query key
 * @param {Object} api - Objeto con funciones de API (create, update, delete)
 * @returns {Object} Hooks de mutación { useCreate, useUpdate, useDelete }
 */
export const createMutationHooks = (resource, resourcePlural, api) => {
  const useCreate = (options = {}) => {
    return useCrudMutation(api.create, {
      queryKey: resourcePlural,
      successMessage: `${resource} creado`,
      errorMessage: `Error al crear ${resource}`,
      ...options,
    });
  };

  const useUpdate = (options = {}) => {
    return useCrudMutation(api.update, {
      queryKey: resourcePlural,
      successMessage: `${resource} actualizado`,
      errorMessage: `Error al actualizar ${resource}`,
      ...options,
    });
  };

  const useDelete = (options = {}) => {
    return useCrudMutation(api.delete, {
      queryKey: resourcePlural,
      successMessage: `${resource} eliminado`,
      errorMessage: `Error al eliminar ${resource}`,
      ...options,
    });
  };

  return { useCreate, useUpdate, useDelete };
};
