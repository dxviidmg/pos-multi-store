import { STORAGE_KEYS } from "../constants/storageKeys";
import { readString } from "../utils/storage";

/**
 * Get user data from localStorage (cached)
 * @returns {Object|null} User object with token and store_id
 */
let _userCache = null;
let _userRaw = null;

export const getUserData = () => {
  const raw = readString(STORAGE_KEYS.USER);
  if (raw !== _userRaw) {
    _userRaw = raw;
    try {
      _userCache = raw ? JSON.parse(raw) : null;
    } catch {
      _userCache = null;
    }
  }
  return _userCache;
};

/**
 * Build API URL for endpoint
 * @param {string} endpoint - API endpoint path
 * @param {boolean} end_slash - Whether to add trailing slash
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint, end_slash = true) =>
  `${process.env.REACT_APP_API_URL}/api/${endpoint}${end_slash ? '/' : ''}`;

/**
 * Enlace de soporte por WhatsApp con un mensaje prellenado
 * @param {string} text - Mensaje inicial
 * @returns {string} URL de api.whatsapp.com
 */
export const getSupportWhatsAppUrl = (text) =>
  `https://api.whatsapp.com/send/?phone=${process.env.REACT_APP_WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;

/**
 * Build printer service URL
 * @param {string} endpoint - Printer endpoint path
 * @returns {string} Full printer URL
 */
export const getPrinterUrl = (endpoint) => {
  return `${process.env.REACT_APP_PRINTER_URL}/${endpoint}/`;
};

/**
 * Build printer service WebSocket URL.
 * Uses REACT_APP_PRINTER_WS_URL if defined; otherwise derives it from
 * REACT_APP_PRINTER_URL by swapping the http(s) scheme for ws(s).
 * @param {string} endpoint - Printer WS endpoint path (e.g. "printer-status")
 * @returns {string} Full printer WebSocket URL
 */
export const getPrinterWsUrl = (endpoint) => {
  const base =
    process.env.REACT_APP_PRINTER_WS_URL ||
    (process.env.REACT_APP_PRINTER_URL || "").replace(/^http/i, "ws");
  return `${base}/${endpoint}/`;
};

/**
 * Build URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters object
 * @returns {URL} URL object with parameters
 */
export const buildUrlWithParams = (baseUrl, params) => {
  const url = new URL(baseUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, value);
      }
    });
  }
  return url;
};

/**
 * Build URL for a static file served by the API (e.g. import templates)
 * @param {string} path - Path under /static/ (e.g. "templates/archivo.xlsx")
 * @returns {string} Full static URL
 */
export const getStaticUrl = (path) => `${process.env.REACT_APP_API_URL}/static/${path}`;

/**
 * Build API WebSocket URL by swapping the http(s) scheme of REACT_APP_API_URL for ws(s).
 * @param {string} path - WebSocket path without leading slash (e.g. "ws/notifications/")
 * @returns {string|null} Full WebSocket URL, or null if REACT_APP_API_URL is not set
 */
export const getApiWsUrl = (path) => {
  const base = process.env.REACT_APP_API_URL?.replace(/^http/, "ws");
  return base ? `${base}/${path}` : null;
};

/**
 * Build FormData from a plain object without mutating it.
 * Skips null, undefined and "" values; booleans become "true"/"false"; Files are appended as-is.
 * @param {Object} data - Plain object
 * @returns {FormData}
 */
export const toFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    if (typeof value === "boolean") {
      formData.append(key, value ? "true" : "false");
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};
