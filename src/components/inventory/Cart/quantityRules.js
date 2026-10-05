import { MOVEMENT_TYPES, UNIT_LABELS, isWeightedUnit } from "../../../constants";

/**
 * Modos de captura de cantidad en el carrito.
 * - PIECE: productos por pieza, costal o bote.
 * - Productos por kilo o litro en venta/apartado: KG (enteros), FRACTION (decimales) o AMOUNT (pesos).
 * - STOCK: productos por kilo o litro en traspaso, distribución o agregar inventario.
 */
export const QUANTITY_MODES = {
  PIECE: "PZ",
  KG: "KG",
  FRACTION: "FRAC",
  AMOUNT: "$",
  STOCK: "STOCK",
};

const { PIECE, KG, FRACTION, AMOUNT, STOCK } = QUANTITY_MODES;

// min: valor mínimo aceptado; step: incremento con flechas; decimals: decimales permitidos al escribir
export const QUANTITY_RULES = {
  [PIECE]: { min: 1, step: 1, decimals: 0 },
  [KG]: { min: 1, step: 1, decimals: 0 },
  [FRACTION]: { min: 0.1, step: 0.1, decimals: 3 },
  [AMOUNT]: { min: 1, step: 1, decimals: 2 },
  [STOCK]: { min: 1, step: 1, decimals: 3 },
};

// Ciclo del botón "Venta por" en productos por kilo o litro
const SALE_MODES_CYCLE = [KG, FRACTION, AMOUNT];

export const getNextSaleMode = (current) =>
  SALE_MODES_CYCLE[(SALE_MODES_CYCLE.indexOf(current) + 1) % SALE_MODES_CYCLE.length];

export const isWeightedItem = (item) => isWeightedUnit(item.product?.unit);

// Venta y apartado permiten elegir cómo se captura un producto por kilo o litro
export const allowsSaleModes = (movementType) =>
  movementType === MOVEMENT_TYPES.SALE || movementType === MOVEMENT_TYPES.RESERVATION;

export const getQuantityMode = (item, movementType, saleModes) => {
  if (!isWeightedItem(item)) return PIECE;
  return allowsSaleModes(movementType) ? saleModes[item.id] || KG : STOCK;
};

export const getUnitLabel = (item) => UNIT_LABELS[item.product?.unit] || UNIT_LABELS.PZ;

// "Kilo"/"Litro" para el modo KG; el resto de modos tiene su propio nombre
export const getSaleModeLabel = (item, mode) =>
  ({ [KG]: getUnitLabel(item), [FRACTION]: "Fracción", [AMOUNT]: "Pesos" }[mode] || getUnitLabel(item));

export const isCustomSaleMode = (mode) => mode === FRACTION || mode === AMOUNT;

const roundTo3 = (value) => Math.round(value * 1000) / 1000;

/** Valor que muestra el input: pesos en modo AMOUNT, cantidad en el resto. */
export const getInputValue = (item, mode) =>
  mode === AMOUNT ? Math.round(item.quantity * item.product_price * 10) / 10 : item.quantity;

/** ¿El texto respeta los decimales permitidos del modo? */
export const isValidQuantityText = (text, mode) => {
  const { decimals } = QUANTITY_RULES[mode];
  const pattern = decimals ? new RegExp(`^\\d*\\.?\\d{0,${decimals}}$`) : /^\d*$/;
  return pattern.test(String(text));
};

/**
 * Convierte lo capturado en cantidad del carrito. Devuelve `null` si está vacío
 * o debajo del mínimo del modo (el carrito no cambia).
 */
export const parseQuantity = (text, item, mode) => {
  if (text === "") return null;
  const value = Number(text);
  if (Number.isNaN(value) || value < QUANTITY_RULES[mode].min) return null;
  return mode === AMOUNT ? value / item.product_price : value;
};

/**
 * Siguiente valor del input con las flechas (`direction` = 1 o -1), o `null` si al subir
 * la cantidad resultante excede `maxQuantity`.
 */
export const getSteppedValue = (item, mode, direction, maxQuantity) => {
  const { min, step } = QUANTITY_RULES[mode];
  const next = roundTo3(getInputValue(item, mode) + direction * step);
  if (direction < 0) return Math.max(min, next);
  const quantity = mode === AMOUNT ? next / item.product_price : next;
  return quantity <= maxQuantity ? next : null;
};

/** Productos KG y LT cuentan como 1 sin importar la cantidad. */
export const countCartProducts = (cart) =>
  cart.reduce((acc, item) => acc + (isWeightedItem(item) ? 1 : item.quantity), 0);

export const formatWeightedQuantity = (item) => `${roundTo3(item.quantity)} ${item.product?.unit?.toLowerCase() || ""}`.trim();
