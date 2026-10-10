/**
 * Archivo de re-exportación — constantes de dominio.
 * Las implementaciones están en:
 * - enums.js — Enumeraciones (MOVEMENT_TYPES, PAYMENT_METHODS, etc.)
 * - helpers.js — Funciones helper (isWeightedUnit, etc.)
 */

// Re-exportar enums
export {
  MOVEMENT_TYPES,
  QUERY_TYPES,
  STORE_TYPES,
  PAYMENT_METHODS,
  PAYMENT_METHOD_OPTIONS,
  SALE_TYPES,
  UNIT_LABELS,
  CANCELLATION_REASONS,
  UI_TEXT,
  PRODUCT_VIEW_OPTIONS,
} from './enums';

// Re-exportar helpers
export { isWeightedUnit } from './helpers';
