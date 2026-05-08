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
export const getApiUrl = (endpoint, end_slash = true) =>
  `${process.env.REACT_APP_API_URL}/api/${endpoint}${end_slash ? '/' : ''}`;

/**
 * Build printer service URL
 * @param {string} endpoint - Printer endpoint path
 * @returns {string} Full printer URL
 */
export const getPrinterUrl = (endpoint) => {
  return `${process.env.REACT_APP_PRINTER_URL}/${endpoint}/`;
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