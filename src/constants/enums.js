/**
 * Enumeraciones de dominio — constantes del sistema.
 * Definen valores permitidos para tipos, métodos, opciones, etc.
 * 
 * Nota: Deben coincidir con los valores del backend (Django).
 */

// Tipos de movimiento de inventario / operación
export const MOVEMENT_TYPES = {
  SALE: 'venta',           // Venta en tienda
  TRANSFER: 'traspaso',    // Traspaso entre sucursales
  DISTRIBUTION: 'distribucion', // Distribución desde almacén
  RESERVATION: 'apartado', // Apartado (venta con anticipo)
  ADD_STOCK: 'agregar',    // Agregar al inventario
  CHECK_STOCK: 'checar',   // Checar precio sin agregar
};

// Tipos de búsqueda de productos (SearchProduct controller)
export const QUERY_TYPES = {
  CODE: 'code',      // Búsqueda por código de barras
  NAME: 'q',         // Búsqueda por nombre/marca
  VISUAL: 'visual',  // Búsqueda visual (galería)
};

// Tipos de sucursal
// STORE = tienda (vende)
// WAREHOUSE = almacén (distribuye)
// GENERAL = vista general del dueño (sin sucursal específica)
export const STORE_TYPES = {
  STORE: 'T',
  WAREHOUSE: 'A',
  GENERAL: 'G',
};

// Métodos de pago (debe coincidir con backend)
export const PAYMENT_METHODS = {
  CASH: 'EF',      // Efectivo
  CARD: 'TA',      // Tarjeta (débito/crédito)
  TRANSFER: 'TR',  // Transferencia bancaria
};

// Opciones de pago en el orden que se muestran (cobro, abono, columnas de caja)
export const PAYMENT_METHOD_OPTIONS = [
  { value: PAYMENT_METHODS.CASH, label: 'Efectivo' },
  { value: PAYMENT_METHODS.CARD, label: 'Tarjeta' },
  { value: PAYMENT_METHODS.TRANSFER, label: 'Transferencia' },
];

// Tipos de venta (backend: sale.sale_type)
export const SALE_TYPES = {
  SALE: 'V',        // Venta normal
  RESERVATION: 'A', // Apartado
};

// Unidades de medida de productos
export const UNIT_LABELS = {
  PZ: 'Pieza',
  CO: 'Costal',
  BO: 'Bote',
  KG: 'Kilo',
  LT: 'Litro',
  MT: 'Metro',
  RO: 'Rollo',
};

// Motivos de cancelación de suscripción (debe coincidir con backend)
export const CANCELLATION_REASONS = [
  { value: "price", label: "Muy caro / precio" },
  { value: "not_using", label: "Ya no uso el sistema" },
  { value: "switched_tool", label: "Cambié de herramienta" },
  { value: "missing_features", label: "Faltan funcionalidades" },
  { value: "technical_issues", label: "Problemas técnicos" },
  { value: "business_closed", label: "Cierre / pausa del negocio" },
  { value: "other", label: "Otro" },
];

// Textos de UI comunes
export const UI_TEXT = {
  ALL: "Todos",
};

// Modos de visualización de productos (tabla / galería)
export const PRODUCT_VIEW_OPTIONS = [
  { value: "table", label: "Tabla" },
  { value: "gallery", label: "Galería" },
];
