import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showSuccess, showWarning, showRequestError } from '../utils/alerts';

/**
 * Hook genérico para crear mutaciones CRUD
 * @param {Function} mutationFn - Función de mutación (create, update, delete)
 * @param {Object} options - Opciones de configuración
 * @param {string|Array} options.queryKey - Query key a invalidar
 * @param {string} options.successMessage - Mensaje de éxito
 * @param {string} options.errorAction - Acción para el mensaje de error ("crear la marca")
 * @param {Function} options.onSuccess - Callback adicional de éxito
 * @param {Function} options.onError - Callback adicional de error
 * @param {Function} options.errorParser - Devuelve el motivo si el error es de validación conocida
 * @returns {Object} Mutation object de React Query
 */
export const useCrudMutation = (mutationFn, options = {}) => {
  const {
    queryKey,
    successMessage,
    errorAction = 'realizar la operación',
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
      const reason = errorParser?.(error);
      if (reason) {
        showWarning(`No se pudo ${errorAction}`, reason);
      } else {
        showRequestError(errorAction, error);
      }
      onErrorCallback?.(error, variables, context);
    },
  });
};

/**
 * Factory para crear hooks de mutación para un recurso
 * @param {string} resource - Nombre del recurso (singular)
 * @param {string} resourcePlural - Nombre del recurso (plural) para query key
 * @param {Object} api - Objeto con funciones de API (create, update, delete)
 * @param {Object} options.feminine - true si el recurso es femenino ("Marca creada")
 * @returns {Object} Hooks de mutación { useCreate, useUpdate, useDelete }
 */
export const createMutationHooks = (resource, resourcePlural, api, { feminine = false } = {}) => {
  const noun = `${feminine ? "la" : "el"} ${resource.toLowerCase()}`;
  const done = (verb) => `${resource} ${verb}${feminine ? "a" : "o"}`;

  const useCreate = (options = {}) => {
    return useCrudMutation(api.create, {
      queryKey: resourcePlural,
      successMessage: done("cread"),
      errorAction: `crear ${noun}`,
      ...options,
    });
  };

  const useUpdate = (options = {}) => {
    return useCrudMutation(api.update, {
      queryKey: resourcePlural,
      successMessage: done("actualizad"),
      errorAction: `actualizar ${noun}`,
      ...options,
    });
  };

  const useDelete = (options = {}) => {
    return useCrudMutation(api.delete, {
      queryKey: resourcePlural,
      successMessage: done("eliminad"),
      errorAction: `eliminar ${noun}`,
      ...options,
    });
  };

  return { useCreate, useUpdate, useDelete };
};
