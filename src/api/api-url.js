/**
 * API URL builders — Funciones para construir URLs de endpoints.
 * Todas las URLs que comunican con el backend parten de aquí.
 */

/**
 * Build API URL for endpoint.
 * @param {string} endpoint - API endpoint path (sin leading/trailing slash)
 * @param {boolean} end_slash - Whether to add trailing slash (default true)
 * @returns {string} Full API URL
 * 
 * @example
 * getApiUrl('products') → 'http://localhost:8000/api/products/'
 * getApiUrl('products/123', false) → 'http://localhost:8000/api/products/123'
 */
export const getApiUrl = (endpoint, end_slash = true) =>
  `${process.env.REACT_APP_API_URL}/api/${endpoint}${end_slash ? '/' : ''}`;

/**
 * Build printer service HTTP URL.
 * @param {string} endpoint - Printer endpoint path
 * @returns {string} Full printer URL
 * 
 * @example
 * getPrinterUrl('status') → 'http://localhost:5000/status/'
 */
export const getPrinterUrl = (endpoint) => {
  return `${process.env.REACT_APP_PRINTER_URL}/${endpoint}/`;
};

/**
 * Build printer service WebSocket URL.
 * Uses REACT_APP_PRINTER_WS_URL si está definido; de lo contrario, deriva de
 * REACT_APP_PRINTER_URL cambiando http(s) por ws(s).
 * 
 * @param {string} endpoint - Printer WS endpoint path
 * @returns {string} Full printer WebSocket URL
 * 
 * @example
 * getPrinterWsUrl('status') → 'ws://localhost:5000/status/'
 */
export const getPrinterWsUrl = (endpoint) => {
  const base =
    process.env.REACT_APP_PRINTER_WS_URL ||
    (process.env.REACT_APP_PRINTER_URL || "").replace(/^http/i, "ws");
  return `${base}/${endpoint}/`;
};

/**
 * Build URL for a static file served by the API (plantillas, descargas).
 * @param {string} path - Path under /static/ (ej: "templates/archivo.xlsx")
 * @returns {string} Full static URL
 * 
 * @example
 * getStaticUrl('templates/import.xlsx') → 'http://localhost:8000/static/templates/import.xlsx'
 */
export const getStaticUrl = (path) => `${process.env.REACT_APP_API_URL}/static/${path}`;

/**
 * Build API WebSocket URL cambiando http(s) a ws(s).
 * @param {string} path - WebSocket path without leading slash
 * @returns {string|null} Full WebSocket URL, o null si REACT_APP_API_URL no está definida
 * 
 * @example
 * getApiWsUrl('ws/notifications/') → 'ws://localhost:8000/ws/notifications/'
 */
export const getApiWsUrl = (path) => {
  const base = process.env.REACT_APP_API_URL?.replace(/^http/, "ws");
  return base ? `${base}/${path}` : null;
};

/**
 * Enlace de soporte por WhatsApp con un mensaje prellenado.
 * @param {string} text - Mensaje inicial
 * @returns {string} URL de api.whatsapp.com
 * 
 * @example
 * getSupportWhatsAppUrl('Hola, necesito ayuda') 
 * → 'https://api.whatsapp.com/send/?phone=...'
 */
export const getSupportWhatsAppUrl = (text) =>
  `https://api.whatsapp.com/send/?phone=${process.env.REACT_APP_WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
