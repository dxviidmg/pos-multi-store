import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useInvalidateCatalogOptions } from "../shared/useCatalogOptions";
import { getImportCanIncludeQuantity, importEleventa, importEleventaValidation } from "../../../api/products";
import { useImportFlow } from "../../../hooks/useImportFlow";
import { showRequestError, showWarning } from "../../../utils/alerts";

const DEFAULT_BRAND = "Sin marca";
const SUCCESS_STATUS = "Exitoso";
export const MIN_WHOLESALE_QUANTITY = 2;

export const isMinQuantityValid = (value) => Number.isInteger(Number(value)) && Number(value) >= MIN_WHOLESALE_QUANTITY;

const isWholesaleConfigured = ({ wholesale_mode: mode, min_wholesale_quantity: quantity }) =>
  mode === "ignore" || (mode === "quantity" && isMinQuantityValid(quantity));

const hasNoStock = (row) => !row.quantity;
const isValidRow = (row) => row.status === SUCCESS_STATUS;

/**
 * Importación de un reporte de inventario de otro sistema: validación y alta en el backend;
 * aquí solo se elige cuáles productos con inventario 0 se omiten.
 */
export const useEleventaImport = () => {
  const invalidateCatalogOptions = useInvalidateCatalogOptions();
  const [validatedRows, setValidatedRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [removedCount, setRemovedCount] = useState(0);

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

  // Correcciones del usuario sobre el archivo (se reenvían con cada validación e importación)
  const editsRef = useRef({});
  const removedRowsRef = useRef([]);
  const latestRowsRef = useRef([]);
  const getCorrections = useCallback(() => ({
    edits: Object.keys(editsRef.current).length ? JSON.stringify(editsRef.current) : "",
    removed_rows: removedRowsRef.current.length ? JSON.stringify(removedRowsRef.current) : "",
  }), []);

  const validate = useCallback(async (form) => {
    const response = await importEleventaValidation({ ...form, ...getCorrections() });
    latestRowsRef.current = response.data;
    setValidatedRows(response.data);
    setSelectedIds(form.import_stock === "Y" ? response.data.filter(hasNoStock).map((row) => row.code) : []);
    return response;
  }, [getCorrections]);

  const excludedRef = useRef([]);
  const importFile = useCallback(
    (form) => importEleventa({
      ...form,
      ...getCorrections(),
      excluded_codes: excludedRef.current.length ? JSON.stringify(excludedRef.current) : "",
    }),
    [getCorrections]
  );

  const flow = useImportFlow({
    initialForm,
    validate,
    importFile,
    importErrorAction: "importar los productos",
    importSuccessMessage: "Productos importados",
    errorsHint: "Corrígelos en la tabla o quita esos productos.",
    onImported: invalidateCatalogOptions,
  });
  const { formData, setFormData } = flow;

  useEffect(() => {
    editsRef.current = {};
    removedRowsRef.current = [];
    setRemovedCount(0);
  }, [formData.file]);

  const saveRowEdit = async (excelRow, changes) => {
    editsRef.current = { ...editsRef.current, [excelRow]: { ...editsRef.current[excelRow], ...changes } };
    const validated = await flow.handleValidation({ silent: true });
    const row = validated && latestRowsRef.current.find((item) => item.excel_row === excelRow);
    if (row && !isValidRow(row)) showWarning(`No se pudo corregir la fila ${excelRow}`, row.status);
    return validated;
  };

  const removeRows = (excelRows) => {
    removedRowsRef.current = [...new Set([...removedRowsRef.current, ...excelRows])];
    setRemovedCount(removedRowsRef.current.length);
    return flow.handleValidation({ silent: true });
  };

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
    saveRowEdit,
    removeRows,
    canIncludeQuantity,
    isFormIncomplete: formData.brand.trim() === "" || formData.import_stock === "" || !isWholesaleConfigured(formData),
    zeroStockRows,
    selectedIds,
    setSelectedIds,
    excludedCount: excluded.length,
    removedCount,
    originalCount: validatedRows.length + removedCount,
    importCount,
    canImport: flow.canImport && importCount > 0,
  };
};
