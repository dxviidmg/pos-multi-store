/**
 * API user data — Funciones para acceder a datos del usuario autenticado.
 * Cachea el usuario desde localStorage para evitar re-parseos frecuentes.
 */

import { STORAGE_KEYS } from "../constants/storageKeys";
import { readString } from "../utils/storage";

/**
 * Cache interno del usuario (se actualiza solo si cambia en localStorage).
 * @private
 */
let _userCache = null;
let _userRaw = null;

/**
 * Get user data from localStorage (cached).
 * Parsea el JSON solo si el raw string cambió desde la última llamada.
 * 
 * @returns {Object|null} User object { token, user_id, store_id, store_type, etc. }
 * 
 * @example
 * const user = getUserData();
 * if (user && user.token) {
 *   // Usuario autenticado
 * }
 */
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
