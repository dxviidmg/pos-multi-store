import { useCallback, useMemo, useRef, useState } from "react";
import { showSuccess, showWarning, showRequestError } from "../utils/alerts";

const SUCCESS_STATUS = "Exitoso";
const SCROLL_DELAY = 300;

const isErrorRow = (row) => row.status !== SUCCESS_STATUS;

/**
 * Flujo de importación desde Excel: elegir/arrastrar archivo → validar → importar.
 * Las filas validadas traen `status` ("Exitoso" o el error); solo se importa si todas son exitosas.
 *
 * @param {Object} config
 * @param {Object} config.initialForm - Formulario inicial; debe incluir `file: ""`. Se vuelve a él tras importar.
 * @param {Function} config.validate - API de validación; recibe `formData`
 * @param {Function} config.importFile - API de importación; recibe `formData`
 * @param {string} config.importErrorAction - Acción para `showRequestError` (p. ej. "importar los productos")
 * @param {string} config.importSuccessMessage - Título de `showSuccess` al importar (p. ej. "Productos importados")
 * @param {Function} [config.onImported] - Se llama después de importar
 * @returns {{
 *   formData: Object, setFormData: Function, handleDataChange: Function,
 *   fileInputRef: Object, fileTableRef: Object, dropZoneProps: Object,
 *   loading: boolean, errorRows: Array, validationResult: ({ successes: number, errors: number }|null),
 *   canImport: boolean, handleValidation: Function, handleImport: Function,
 * }}
 */
export const useImportFlow = ({ initialForm, validate, importFile, importErrorAction, importSuccessMessage, onImported }) => {
  const fileInputRef = useRef(null);
  const fileTableRef = useRef(null);
  const requestRef = useRef(0);
  const initialFormRef = useRef(initialForm);
  initialFormRef.current = initialForm;

  const [formData, setFormData] = useState(initialForm);
  // null = archivo sin validar
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const clearFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const setFile = useCallback((file) => {
    // Invalida una validación en curso del archivo anterior
    requestRef.current += 1;
    setFormData((prev) => ({ ...prev, file }));
    setRows(null);
  }, []);

  const handleDataChange = useCallback((e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFile(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, [setFile]);

  const dropZoneProps = {
    isDragging,
    onDragOver: (e) => { e.preventDefault(); setIsDragging(true); },
    onDragLeave: () => setIsDragging(false),
    onDrop: (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;
      clearFileInput();
      setFile(file);
    },
  };

  const handleValidation = async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    try {
      const response = await validate(formData);
      if (requestId !== requestRef.current) return;
      setRows(response.data);
      const errorCount = response.data.filter(isErrorRow).length;
      if (errorCount > 0) {
        showWarning("Archivo cargado con errores", `${errorCount} filas tienen errores. Corrige los errores y vuelve a subir el archivo.`);
        setTimeout(() => fileTableRef.current?.scrollIntoView({ behavior: "smooth" }), SCROLL_DELAY);
      } else {
        showSuccess("Archivo cargado", "Todas las filas están bien");
      }
    } catch (error) {
      if (requestId !== requestRef.current) return;
      clearFileInput();
      showRequestError("validar el archivo", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      await importFile(formData);
      setRows(null);
      setFormData(initialFormRef.current);
      clearFileInput();
      showSuccess(importSuccessMessage);
      onImported?.();
    } catch (error) {
      showRequestError(importErrorAction, error);
    } finally {
      setLoading(false);
    }
  };

  const errorRows = useMemo(() => (rows ? rows.filter(isErrorRow) : []), [rows]);
  const validationResult = useMemo(
    () => (rows ? { successes: rows.length - errorRows.length, errors: errorRows.length } : null),
    [rows, errorRows]
  );
  const canImport = Boolean(rows?.length) && errorRows.length === 0;

  return {
    formData,
    setFormData,
    handleDataChange,
    fileInputRef,
    fileTableRef,
    dropZoneProps,
    loading,
    errorRows,
    validationResult,
    canImport,
    handleValidation,
    handleImport,
  };
};
