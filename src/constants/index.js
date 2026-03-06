// Tipos de movimiento
export const MOVEMENT_TYPES = {
  SALE: 'venta',
  TRANSFER: 'traspaso',
  DISTRIBUTION: 'distribucion',
  RESERVATION: 'apartado',
  ADD_STOCK: 'agregar'
};

// Tipos de tienda
export const STORE_TYPES = {
  WAREHOUSE: 'A',
  STORE: 'B'
};

// Roles de usuario
export const USER_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  SELLER: 'seller'
};

// Métodos de pago
export const PAYMENT_METHODS = {
  CASH: 'EF',
  CARD: 'TC',
  TRANSFER: 'TR'
};

// Estados de venta
export const SALE_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  CANCELLED: 'cancelled'
};

// Tiempos de cache (en milisegundos)
export const CACHE_TIME = {
  SHORT: 1 * 60 * 1000,      // 1 minuto
  MEDIUM: 5 * 60 * 1000,     // 5 minutos
  LONG: 30 * 60 * 1000,      // 30 minutos
  VERY_LONG: 60 * 60 * 1000  // 1 hora
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor verifica tu internet.',
  UNAUTHORIZED: 'Sesión expirada. Por favor inicia sesión nuevamente.',
  SERVER_ERROR: 'Error del servidor. Por favor intenta más tarde.',
  NOT_FOUND: 'Recurso no encontrado.',
  VALIDATION_ERROR: 'Por favor verifica los datos ingresados.'
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Opciones de filtros comunes
export const FILTER_OPTIONS = {
  ALL: "",
  ALL_LABEL: "Todos",
};

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
