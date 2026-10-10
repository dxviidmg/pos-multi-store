/**
 * Archivo de re-exportación para backward compatibility.
 * Las implementaciones están en:
 * - api-url.js — Builders de URLs (getApiUrl, getPrinterUrl, etc.)
 * - api-user.js — Acceso a datos de usuario (getUserData)
 * - api-serializers.js — Transformación de datos (toFormData, buildUrlWithParams)
 */

// Re-exportar URL builders
export {
  getApiUrl,
  getPrinterUrl,
  getPrinterWsUrl,
  getStaticUrl,
  getApiWsUrl,
  getSupportWhatsAppUrl,
} from './api-url';

// Re-exportar user data
export { getUserData } from './api-user';

// Re-exportar serializers
export {
  buildUrlWithParams,
  toFormData,
} from './api-serializers';
