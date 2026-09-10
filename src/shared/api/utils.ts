import type { AuthUser } from '@/src/shared/types/domain';
import type { QueryParams } from '@/src/shared/types/api';

/**
 * Get user data from localStorage (cached).
 */
let _userCache: AuthUser | null = null;
let _userRaw: string | null = null;

export const getUserData = (): AuthUser | null => {
  const raw = localStorage.getItem('user');
  if (raw !== _userRaw) {
    _userRaw = raw;
    _userCache = raw ? (JSON.parse(raw) as AuthUser) : null;
  }
  return _userCache;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;
const PRINTER_URL = process.env.NEXT_PUBLIC_PRINTER_URL || process.env.REACT_APP_PRINTER_URL;
const PRINTER_WS_URL = process.env.NEXT_PUBLIC_PRINTER_WS_URL || process.env.REACT_APP_PRINTER_WS_URL;

/**
 * Build API URL for endpoint.
 */
export const getApiUrl = (endpoint: string, end_slash = true): string =>
  `${API_URL}/api/${endpoint}${end_slash ? '/' : ''}`;

/**
 * Build printer service URL.
 */
export const getPrinterUrl = (endpoint: string): string => {
  return `${PRINTER_URL}/${endpoint}/`;
};

/**
 * Build printer service WebSocket URL.
 * Uses PRINTER_WS_URL if defined; otherwise derives it from
 * PRINTER_URL by swapping the http(s) scheme for ws(s).
 */
export const getPrinterWsUrl = (endpoint: string): string => {
  const base = PRINTER_WS_URL || (PRINTER_URL || '').replace(/^http/i, 'ws');
  return `${base}/${endpoint}/`;
};

/**
 * Build URL with query parameters.
 */
export const buildUrlWithParams = (baseUrl: string, params?: QueryParams): string => {
  const url = new URL(baseUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
};
