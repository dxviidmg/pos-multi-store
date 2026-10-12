import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useInvalidateCatalogOptions } from "../shared/useCatalogOptions";
import { getImportCanIncludeQuantity } from "../../../api/products";
import { useImportFlow } from "../../../hooks/useImportFlow";
import { showRequestError, showWarning } from "../../../utils/alerts";

const SUCCESS_STATUS = "Exitoso";

const hasNoStock = (row) => !row.quantity;
const isValidRow = (row) => row.status === SUCCESS_STATUS;

/**
 * Importación de productos con corrección de errores en la tabla y selección de productos con inventario 0.
 * El backend valida e importa; aquí se guardan las correcciones del usuario (`edits`, `removed_rows`) y
 * se reenvían con cada validación e importación.
 *
 * @param {Object} config
 * @param {Object} config.baseForm - Formulario inicial sin `import_stock` (debe incluir `file: ""`)
 * @param {Function} config.validateApi - API de validación; recibe `formData` y las correcciones
 * @param {Function} config.importApi - API de importación; recibe `formData`, las correcciones y `excluded_codes`
 * @returns Lo de `useImportFlow` más `saveRowEdit`, `removeRows`, `canIncludeQuantity`, los productos con
 * inventario 0 (`zeroStockRows`, `selectedIds`, `setSelectedIds`) y los conteos del resumen.
 */
export const useEditableImport = ({ baseForm, validateApi, importApi }) => {
  const invalidateCatalogOptions = useInvalidateCatalogOptions();
  const [validatedRows, setValidatedRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [removedCount, setRemovedCount] = useState(0);

  // El backend permite agregar stock junto con los productos (primera importación con una sola tienda)
  const { data: canIncludeQuantity = false, error: configError } = useQuery({
    queryKey: ["import-can-include-quantity"],
    queryFn: getImportCanIncludeQuantity,
    select: (response) => response.data,
    refetchOnMount: "always",
  });

  const initialForm = useMemo(
    () => ({ ...baseForm, import_stock: canIncludeQuantity ? "" : "N" }),
    [baseForm, canIncludeQuantity]
  );

  const editsRef = useRef({});
  const removedRowsRef = useRef([]);
  const latestRowsRef = useRef([]);
  const excludedRef = useRef([]);
  const getCorrections = useCallback(() => ({
    edits: Object.keys(editsRef.current).length ? JSON.stringify(editsRef.current) : "",
    removed_rows: removedRowsRef.current.length ? JSON.stringify(removedRowsRef.current) : "",
  }), []);

  const validate = useCallback(async (form) => {
    const response = await validateApi({ ...form, ...getCorrections() });
    latestRowsRef.current = response.data;
    setValidatedRows(response.data);
    setSelectedIds(form.import_stock === "Y" ? response.data.filter(hasNoStock).map((row) => row.code) : []);
    return response;
  }, [validateApi, getCorrections]);

  const importFile = useCallback(
    (form) => importApi({
      ...form,
      ...getCorrections(),
      excluded_codes: excludedRef.current.length ? JSON.stringify(excludedRef.current) : "",
    }),
    [importApi, getCorrections]
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
