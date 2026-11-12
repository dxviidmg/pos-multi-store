/**
 * Archivo de re-exportación para backward compatibility.
 * Las implementaciones están en:
 * - menu-config.js — Datos puros del menú (ICONS, MENU_ACTIONS, buildLinksByType)
 * - menu-builders.js — Lógica de construcción y filtrado (buildMenu, filterMenu)
 */

// Re-exportar configuración
export {
  MENU_ACTIONS,
  STORE_SELECTOR_LABEL,
  ICONS,
  getMenuIcon,
  buildLinksByType,
} from './menu-config';

// Re-exportar funciones de construcción
export {
  buildStoreSwitcher,
  filterMenu,
  buildMenu,
} from './menu-builders';
