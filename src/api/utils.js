/**
 * Get user data from localStorage
 * @returns {Object|null} User object with token and store_id
 */
export const getUserData = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/**
 * Build request headers with authentication
 * @param {boolean} isMultipart - Whether request is multipart/form-data
 * @returns {Object} Headers object
 */
export const getHeaders = (isMultipart = false) => {
  const user = getUserData();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  return {
    "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
    "Authorization": `Token ${user.token}`,
    "store-id": user.store_id,
  };
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