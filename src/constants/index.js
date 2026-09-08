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
};

// Tipos de tienda
export const STORE_TYPES = {
  WAREHOUSE: 'A',
  STORE: 'B'
};

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
  ALL_DEPARTMENTS: "Todos los departamentos",
  ALL_BRANDS: "Todas las marcas",
  ALL_STORES: "Todas las tiendas",
  LOADING: "Cargando...",
  NO_DATA: "No hay datos disponibles",
  ERROR: "Error",
  SUCCESS: "Éxito",
  CANCEL: "Cancelar",
  SAVE: "Guardar",
  DELETE: "Eliminar",
  EDIT: "Editar",
  ADD: "Agregar",
  SEARCH: "Buscar",
};
