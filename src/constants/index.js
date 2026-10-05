// Tipos de movimiento
export const MOVEMENT_TYPES = {
  SALE: 'venta',
  TRANSFER: 'traspaso',
  DISTRIBUTION: 'distribucion',
  RESERVATION: 'apartado',
  ADD_STOCK: 'agregar',
  CHECK_STOCK: 'checar',
};

// Tipos de búsqueda (usados en SearchProduct queryType)
export const QUERY_TYPES = {
  CODE: 'code',
  NAME: 'q',
  VISUAL: 'visual',
};

// Tipos de sucursal (user.store_type); GENERAL = vista general sin sucursal
export const STORE_TYPES = {
  STORE: 'T',
  WAREHOUSE: 'A',
  GENERAL: 'G',
};

// Métodos de pago (deben coincidir con el backend)
export const PAYMENT_METHODS = {
  CASH: 'EF',
  CARD: 'TA',
  TRANSFER: 'TR',
};

// Medios de pago en el orden en que se muestran (cobro, abono y columnas de caja)
export const PAYMENT_METHOD_OPTIONS = [
  { value: PAYMENT_METHODS.CASH, label: 'Efectivo' },
  { value: PAYMENT_METHODS.CARD, label: 'Tarjeta' },
  { value: PAYMENT_METHODS.TRANSFER, label: 'Transferencia' },
];

// Tipos de venta (sale.sale_type en el backend)
export const SALE_TYPES = {
  SALE: 'V',
  RESERVATION: 'A',
};

// Unidades de medida del producto (product.unit)
export const UNIT_LABELS = {
  PZ: 'Pieza',
  CO: 'Costal',
  BO: 'Bote',
  KG: 'Kilo',
  LT: 'Litro',
};

// Unidades que se venden por fracción (kilos o litros)
export const isWeightedUnit = (unit) => unit === 'KG' || unit === 'LT';

// Motivos de cancelación de suscripción (deben coincidir con el backend)
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

// Modos de visualización de listas de productos (ver useViewModePreference)
export const PRODUCT_VIEW_OPTIONS = [
  { value: "table", label: "Tabla" },
  { value: "gallery", label: "Galería" },
];
