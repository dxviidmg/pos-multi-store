import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useBrands } from "../../../hooks/useBrands";
import { useDepartments } from "../../../hooks/useDepartments";
import { showRequestError } from "../../../utils/alerts";

const BRANDS_KEY = "brands";
const DEPARTMENTS_KEY = "departments";

/**
 * Marcas y departamentos (cacheados con React Query) para filtros y formularios de productos.
 * `loaded` es true cuando ambas listas respondieron; un error se avisa una sola vez.
 *
 * @param {Object} [params] - Filtros de la API (p. ej. `{ audit: true }`)
 * @returns {{ brands: Array, departments: Array, loaded: boolean }}
 */
export const useCatalogOptions = (params) => {
  const brandsQuery = useBrands(params);
  const departmentsQuery = useDepartments(params);
  const error = brandsQuery.error || departmentsQuery.error;

  useEffect(() => {
    if (error) showRequestError("cargar las marcas y departamentos", error);
  }, [error]);

  return {
    brands: brandsQuery.data || [],
    departments: departmentsQuery.data || [],
    loaded: brandsQuery.isSuccess && departmentsQuery.isSuccess,
  };
};

/**
 * Invalida marcas y departamentos en caché (sus `product_count` cambian al crear,
 * editar, eliminar, importar o reasignar productos).
 */
export const useInvalidateCatalogOptions = () => {
  const queryClient = useQueryClient();
  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [BRANDS_KEY] });
    queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_KEY] });
  }, [queryClient]);
};
