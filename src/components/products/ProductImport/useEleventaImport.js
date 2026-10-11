import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useInvalidateCatalogOptions } from "../shared/useCatalogOptions";
import { getImportCanIncludeQuantity, importEleventa, importEleventaValidation } from "../../../api/products";
import { useImportFlow } from "../../../hooks/useImportFlow";
import { showRequestError } from "../../../utils/alerts";

const DEFAULT_BRAND = "Sin marca";
export const MIN_WHOLESALE_QUANTITY = 2;

export const isMinQuantityValid = (value) => Number.isInteger(Number(value)) && Number(value) >= MIN_WHOLESALE_QUANTITY;

const isWholesaleConfigured = ({ wholesale_mode: mode, min_wholesale_quantity: quantity }) =>
  mode === "ignore" || (mode === "quantity" && isMinQuantityValid(quantity));

const hasNoStock = (row) => !row.quantity;

/**
 * Importación de un reporte de inventario de otro sistema: validación y alta en el backend;
 * aquí solo se elige cuáles productos con inventario 0 se omiten.
 */
export const useEleventaImport = () => {
  const invalidateCatalogOptions = useInvalidateCatalogOptions();
  const [validatedRows, setValidatedRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const { data: canIncludeQuantity = false, error: configError } = useQuery({
    queryKey: ["import-can-include-quantity"],
    queryFn: getImportCanIncludeQuantity,
    select: (response) => response.data,
    refetchOnMount: "always",
  });

  const initialForm = useMemo(
    () => ({
      file: "",
      brand: DEFAULT_BRAND,
      import_stock: canIncludeQuantity ? "" : "N",
      wholesale_mode: "",
      min_wholesale_quantity: String(MIN_WHOLESALE_QUANTITY),
    }),
    [canIncludeQuantity]
  );

  const validate = useCallback(async (form) => {
    const response = await importEleventaValidation(form);
    setValidatedRows(response.data);
    setSelectedIds(form.import_stock === "Y" ? response.data.filter(hasNoStock).map((row) => row.code) : []);
    return response;
  }, []);

  const excludedRef = useRef([]);
  const importFile = useCallback(
    (form) => importEleventa({ ...form, excluded_codes: excludedRef.current.length ? JSON.stringify(excludedRef.current) : "" }),
    []
  );

  const flow = useImportFlow({
    initialForm,
    validate,
    importFile,
    importErrorAction: "importar los productos",
    importSuccessMessage: "Productos importados",
    onImported: invalidateCatalogOptions,
  });
  const { formData, setFormData } = flow;

  useEffect(() => {
    if (configError) showRequestError("cargar la configuración de importación", configError);
  }, [configError]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, import_stock: canIncludeQuantity ? "" : "N" }));
  }, [canIncludeQuantity, setFormData]);

  const zeroStockRows = useMemo(
    () => (flow.canImport && formData.import_stock === "Y"
      ? validatedRows.filter(hasNoStock).map((row) => ({ ...row, id: row.code }))
      : []),
    [flow.canImport, formData.import_stock, validatedRows]
  );

  const excluded = useMemo(
    () => zeroStockRows.filter((row) => !selectedIds.includes(row.id)).map((row) => row.code),
    [zeroStockRows, selectedIds]
  );
  excludedRef.current = excluded;

  const importCount = flow.canImport ? validatedRows.length - excluded.length : 0;

  return {
    ...flow,
    canIncludeQuantity,
    isFormIncomplete: formData.brand.trim() === "" || formData.import_stock === "" || !isWholesaleConfigured(formData),
    zeroStockRows,
    selectedIds,
    setSelectedIds,
    excludedCount: excluded.length,
    totalCount: validatedRows.length,
    importCount,
    canImport: flow.canImport && importCount > 0,
  };
};
