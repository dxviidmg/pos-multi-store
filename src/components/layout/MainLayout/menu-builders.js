/**
 * Menu builders — Funciones para construir y filtrar el menú según permisos.
 * Contiene la lógica de permisos y filtrado.
 */

import { isOwner, canAccessRoute, getViewType } from "../../../constants/routeAccess";
import { MENU_ACTIONS, STORE_SELECTOR_LABEL, buildLinksByType } from "./menu-config";
import { SECTIONS, getAccessibleTabs } from "./menu-sections";

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

const resolveLink = (user, item) => {
  if (item.section) {
    const section = SECTIONS[item.section];
    const tabs = getAccessibleTabs(user, section);
    if (!tabs.length) return [];
    const [first] = tabs;
    return [{
      label: tabs.length === 1 ? first.fullLabel : section.label,
      iconKey: section.label,
      href: first.href,
      sectionId: item.section,
    }];
  }
  return canAccessRoute(user, item.href) ? [item] : [];
};

/**
 * Filtra el menú según los permisos del usuario.
 * Quita items sin acceso y submenús vacíos; un submenú con un solo ítem pasa a ser ese enlace directo. Una sección es una sola entrada que abre
 * su primera pestaña accesible; con una sola pestaña, toma el nombre completo de esa pantalla.
 * 
 * @param {Object} user - Usuario
 * @param {Array} items - Items del menú sin filtrar
 * @returns {Array} Items filtrados por permisos
 * @private
 */
export const filterMenu = (user, items) => items.flatMap((item) => {
  if (item.action) return [item];
  if (item.dropdown) {
    const dropdown = item.dropdown.flatMap((sub) => resolveLink(user, sub));
    if (dropdown.length === 1 && !item.action) return [{ iconKey: item.label, ...dropdown[0] }];
    return dropdown.length ? [{ ...item, dropdown }] : [];
  }
  return resolveLink(user, item);
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
