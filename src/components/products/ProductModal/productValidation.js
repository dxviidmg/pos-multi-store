/**
 * Reglas de precios de producto compartidas por ProductModal (alta/edición) y
 * PriceUpdateModal (actualización masiva). Los valores llegan como strings de input ("" = vacío).
 */

const MESSAGES = {
  positive: "Debe ser mayor a 0",
  belowUnitPrice: "Debe ser menor al precio unitario",
  aboveCost: "Debe ser mayor al costo",
  minQty: "Debe ser un entero mayor o igual a 2",
  required: "Requerido",
};

/**
 * Errores por campo (texto corto para `helperText`) y `hasAnyError`.
 * Con `partial` (actualización masiva) solo se aplican las reglas que no bloquean datos
 * existentes: costo y mayoreo menores al precio unitario, y mayoreo completo (precio y cantidad).
 * Los campos vacíos no se comparan.
 *
 * @param {{ cost: string, unit_price: string, wholesale_price: string, min_wholesale_quantity: string }} values
 * @param {{ partial?: boolean }} [options]
 * @returns {{ cost: string, unitPrice: string, wholesale: string, minQty: string, hasAnyError: boolean }}
 */
export const getPriceErrors = (values, { partial = false } = {}) => {
  const hasCost = values.cost !== "";
  const hasUnitPrice = values.unit_price !== "";
  const hasWholesale = values.wholesale_price !== "";
  const hasMinQty = values.min_wholesale_quantity !== "";

  const cost = Number(values.cost);
  const unitPrice = Number(values.unit_price);
  const wholesalePrice = Number(values.wholesale_price);
  const minWholesaleQty = Number(values.min_wholesale_quantity);

  const errors = { cost: "", unitPrice: "", wholesale: "", minQty: "" };

  if (!partial && hasCost && cost <= 0) errors.cost = MESSAGES.positive;
  if (!partial && hasUnitPrice && unitPrice <= 0) errors.unitPrice = MESSAGES.positive;
  if (hasCost && hasUnitPrice && cost >= unitPrice) errors.cost = MESSAGES.belowUnitPrice;

  if (hasWholesale || hasMinQty) {
    if (!hasWholesale) {
      errors.wholesale = MESSAGES.required;
    } else if (!hasMinQty) {
      errors.minQty = MESSAGES.required;
    } else {
      if ((!partial || hasUnitPrice) && wholesalePrice >= unitPrice) errors.wholesale = MESSAGES.belowUnitPrice;
      if (!partial && wholesalePrice <= cost) errors.wholesale = MESSAGES.aboveCost;
      if (!partial && (!Number.isInteger(minWholesaleQty) || minWholesaleQty < 2)) errors.minQty = MESSAGES.minQty;
    }
  }

  return { ...errors, hasAnyError: Object.values(errors).some(Boolean) };
};

/**
 * Faltan campos obligatorios del producto: todo excepto mayoreo, imagen y departamento.
 * Mayoreo debe venir completo (precio y cantidad) o vacío. Con `requiresInitialStock`
 * (alta dentro de la única tienda) el stock inicial debe ser mayor a 0.
 */
export const isProductFormIncomplete = (formData, { requiresInitialStock }) => {
  const {
    wholesale_price,
    min_wholesale_quantity,
    wholesale_price_on_client_discount,
    image,
    department,
    department_name,
    initial_stock,
    ...requiredFields
  } = formData;

  const areRequiredFieldsComplete = !Object.values(requiredFields).some((value) => value === "");
  const areOptionalFieldsConsistent = (wholesale_price === "") === (min_wholesale_quantity === "");
  const isInitialStockComplete = !requiresInitialStock || (initial_stock !== "" && parseInt(initial_stock) > 0);

  return !areRequiredFieldsComplete || !areOptionalFieldsConsistent || !isInitialStockComplete;
};
