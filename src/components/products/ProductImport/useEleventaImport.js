import { useMemo } from "react";
import { importEleventa, importEleventaValidation } from "../../../api/products";
import { useEditableImport } from "./useEditableImport";

export const MIN_WHOLESALE_QUANTITY = 2;

export const isMinQuantityValid = (value) => Number.isInteger(Number(value)) && Number(value) >= MIN_WHOLESALE_QUANTITY;

const BASE_FORM = {
  file: "",
  brand: "Sin marca",
  wholesale_mode: "",
  min_wholesale_quantity: String(MIN_WHOLESALE_QUANTITY),
};

const isWholesaleConfigured = ({ wholesale_mode: mode, min_wholesale_quantity: quantity }) =>
  mode === "ignore" || (mode === "quantity" && isMinQuantityValid(quantity));

/** Importación de un reporte de inventario de otro sistema (marca fija y opción de mayoreo). */
export const useEleventaImport = () => {
  const importState = useEditableImport({
    baseForm: BASE_FORM,
    validateApi: importEleventaValidation,
    importApi: importEleventa,
  });
  const { formData } = importState;

  const isFormIncomplete = useMemo(
    () => formData.brand.trim() === "" || formData.import_stock === "" || !isWholesaleConfigured(formData),
    [formData]
  );

  return { ...importState, isFormIncomplete };
};
