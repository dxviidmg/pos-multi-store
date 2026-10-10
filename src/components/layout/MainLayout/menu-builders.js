/**
 * Menu builders — Funciones para construir y filtrar el menú según permisos.
 * Contiene la lógica de permisos y filtrado.
 */

import { isOwner, canAccessRoute, getViewType } from "../../../constants/routeAccess";
import { MENU_ACTIONS, STORE_SELECTOR_LABEL, buildLinksByType } from "./menu-config";

/**
 * Construye el selector de sucursal (dueño con multi-store o botón "Regresar").
 * 
 * @param {Object} user - Usuario
 * @param {Array} stores - Sucursales disponibles
 * @returns {Array} Items del selector o "Regresar"
 * @private
 */
export const buildStoreSwitcher = (user, stores) => {
  if (!isOwner(user)) return [];
  if (user.multistore) {
    return [{
      label: STORE_SELECTOR_LABEL,
      action: MENU_ACTIONS.STORE_SELECTOR,
      dropdown: stores.map((s) => ({ label: s.full_name || s.name, storeId: s.id })),
    }];
  }
  return [{ label: "Regresar", action: MENU_ACTIONS.GO_BACK }];
};

/**
 * Filtra el menú según los permisos del usuario.
 * Quita items ocultos (`hidden`), items sin acceso, y submenús vacíos.
 * 
 * @param {Object} user - Usuario
 * @param {Array} items - Items del menú sin filtrar
 * @returns {Array} Items filtrados por permisos
 * @private
 */
export const filterMenu = (user, items) => items.flatMap((item) => {
  if (item.hidden) return [];
  if (item.action) return [item];
  if (item.dropdown) {
    const dropdown = item.dropdown.filter((sub) => canAccessRoute(user, sub.href));
    return dropdown.length ? [{ ...item, dropdown }] : [];
  }
  return canAccessRoute(user, item.href) ? [item] : [];
});

/**
 * Construye el menú lateral del usuario para su vista actual (tienda, almacén o general).
 * Ya filtrado por permisos. `stores` llena el selector de sucursal del dueño.
 * 
 * @param {Object} user - Usuario autenticado
 * @param {Object} options - Opciones
 * @param {Array} [options.stores] - Sucursales disponibles (para selector)
 * @returns {Array} Menú filtrado y construido
 * 
 * @example
 * const menu = buildMenu(user, { stores: [{ id: 1, name: "Tienda A" }] });
 * // → Items del menú según tipo de vista y permisos
 */
export const buildMenu = (user, { stores = [] } = {}) => {
  const linksByType = buildLinksByType(user, buildStoreSwitcher(user, stores));
  return filterMenu(user, linksByType[getViewType(user)]);
};
