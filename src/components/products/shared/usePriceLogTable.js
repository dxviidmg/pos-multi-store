import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductPriceLogs } from "../../../api/products";
import { getFormattedDateTime } from "../../../utils/utils";
import { showRequestError } from "../../../utils/alerts";

export const PRICE_LOGS_KEY = "product-price-logs";

/** Agrupa los cambios de un mismo producto en el mismo minuto en una fila (un campo por columna). */
const groupPriceLogs = (logs) => {
  const map = {};
  logs.forEach((log) => {
    const key = `${log.product}-${log.created_at.slice(0, 16)}`;
    if (!map[key]) {
      map[key] = {
        id: key,
        date: log.created_at,
        user: log.user_username,
        product_code: log.product_code,
        brand_name: log.brand_name,
        product_name: log.product_name,
      };
    }
    map[key][log.field] = `${log.previous_value} → ${log.new_value}`;
  });
  return Object.values(map);
};

/** Campos que aparecen en los cambios: `[[field, field_display], …]`. */
const getChangedFields = (logs) => {
  const seen = {};
  logs.forEach((log) => { seen[log.field] = log.field_display; });
  return Object.entries(seen);
};

/**
 * Historial de cambios de precio (`getProductPriceLogs`) agrupado para tabla.
 * Se consulta de nuevo cada vez que se monta (los precios cambian desde otras pantallas).
 *
 * @param {{ productId?: number, months?: number }} params
 * @param {{ enabled?: boolean, sortable?: boolean }} [options]
 * @returns {{ rows: Array, fields: Array, fieldColumns: Array, isLoading: boolean }}
 */
export const usePriceLogTable = (params, { enabled = true, sortable = false } = {}) => {
  const { data: logs = [], isLoading, error } = useQuery({
    queryKey: [PRICE_LOGS_KEY, params],
    queryFn: () => getProductPriceLogs(params),
    select: (response) => response.data,
    enabled,
    staleTime: 0,
  });

  useEffect(() => {
    if (error) showRequestError("cargar el historial de precios", error);
  }, [error]);

  const rows = useMemo(() => groupPriceLogs(logs), [logs]);
  const fields = useMemo(() => getChangedFields(logs), [logs]);

  const fieldColumns = useMemo(() => [
    { name: "Fecha", selector: (row) => getFormattedDateTime(row.date), minWidth: 150, ...(sortable && { sortable }) },
    ...fields.map(([field, display]) => ({
      name: display,
      selector: (row) => row[field] || "-",
    })),
  ], [fields, sortable]);

  return { rows, fields, fieldColumns, isLoading };
};
