/**
 * Get user data from localStorage (cached)
 * @returns {Object|null} User object with token and store_id
 */
let _userCache = null;
let _userRaw = null;

export const getUserData = () => {
  const raw = localStorage.getItem("user");
  if (raw !== _userRaw) {
    _userRaw = raw;
    _userCache = raw ? JSON.parse(raw) : null;
  }
  return _userCache;
};

/**
 * Build API URL for endpoint
 * @param {string} endpoint - API endpoint path
 * @param {boolean} end_slash - Whether to add trailing slash
 * @returns {string} Full API URL
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;
const PRINTER_URL = process.env.NEXT_PUBLIC_PRINTER_URL || process.env.REACT_APP_PRINTER_URL;
const PRINTER_WS_URL = process.env.NEXT_PUBLIC_PRINTER_WS_URL || process.env.REACT_APP_PRINTER_WS_URL;

export const getApiUrl = (endpoint, end_slash = true) =>
  `${API_URL}/api/${endpoint}${end_slash ? '/' : ''}`;

/**
 * Build printer service URL
 * @param {string} endpoint - Printer endpoint path
 * @returns {string} Full printer URL
 */
export const getPrinterUrl = (endpoint) => {
  return `${PRINTER_URL}/${endpoint}/`;
};

/**
 * Build printer service WebSocket URL.
 * Uses PRINTER_WS_URL if defined; otherwise derives it from
 * PRINTER_URL by swapping the http(s) scheme for ws(s).
 * @param {string} endpoint - Printer WS endpoint path (e.g. "printer-status")
 * @returns {string} Full printer WebSocket URL
 */
export const getPrinterWsUrl = (endpoint) => {
  const base =
    PRINTER_WS_URL ||
    (PRINTER_URL || "").replace(/^http/i, "ws");
  return `${base}/${endpoint}/`;
};

/**
 * Build URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters object
 * @returns {string} URL string with parameters
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
  return url.toString();
};