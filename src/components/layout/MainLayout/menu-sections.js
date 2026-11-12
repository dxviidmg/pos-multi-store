/**
 * Secciones del menú — Datos puros y helpers.
 * Cada sección es una entrada del menú; sus pestañas son rutas independientes.
 * `label` es el texto de la pestaña; `fullLabel`, el nombre de la entrada cuando
 * solo queda esa pestaña. `views` limita la sección a ciertas vistas: una ruta puede
 * estar en dos secciones si sus vistas no coinciden.
 */

import { STORE_TYPES } from "../../../constants";
import { canAccessRoute, getViewType, normalizePath } from "../../../constants/routeAccess";

export const SECTIONS = {
  sales: {
    label: "Ventas y apartados",
    tabs: [
      { label: "Ventas", fullLabel: "Ventas", href: "/ventas/" },
      { label: "Apartados", fullLabel: "Apartados", href: "/apartados/" },
    ],
  },
  cash: {
    label: "Caja",
    tabs: [
      { label: "Corte de caja", fullLabel: "Corte de caja", href: "/corte-caja/" },
      { label: "Movimientos", fullLabel: "Movimientos en caja", href: "/movimientos-caja/" },
    ],
  },
  transfers: {
    label: "Movimientos",
    tabs: [
      { label: "Distribuciones", fullLabel: "Distribuciones", href: "/distribuciones/" },
      { label: "Traspasos", fullLabel: "Traspasos", href: "/traspasos/" },
    ],
  },
  products: {
    label: "Productos",
    views: [STORE_TYPES.GENERAL],
    tabs: [
      { label: "Productos", fullLabel: "Productos", href: "/productos/" },
      { label: "Catálogo", fullLabel: "Catálogo", href: "/catalogo/" },
      { label: "Conversiones", fullLabel: "Conversiones", href: "/conversiones/" },
      { label: "Reasignación", fullLabel: "Reasignación", href: "/reasignacion/" },
      { label: "Historial de precios", fullLabel: "Historial de cambio de precios", href: "/historial-precios/" },
    ],
  },
  inventory: {
    label: "Inventario",
    views: [STORE_TYPES.STORE, STORE_TYPES.WAREHOUSE],
    tabs: [
      { label: "Inventario", fullLabel: "Inventario", href: "/inventario/" },
      { label: "Ajustes", fullLabel: "Ajustes de inventario", href: "/ajustes-inventario/" },
      { label: "Por verificar", fullLabel: "Inventario a verificar", href: "/inventario-a-verificar/" },
    ],
  },
  catalog: {
    label: "Marcas y departamentos",
    tabs: [
      { label: "Marcas", fullLabel: "Marcas", href: "/marcas/" },
      { label: "Departamentos", fullLabel: "Departamentos", href: "/departamentos/" },
    ],
  },
  imports: {
    label: "Importar",
    tabs: [
      { label: "Productos", fullLabel: "Importar productos", href: "/importar-productos/" },
      { label: "Inventario", fullLabel: "Importar inventario", href: "/importar-inventario/" },
    ],
  },
  history: {
    label: "Historial",
    views: [STORE_TYPES.STORE, STORE_TYPES.WAREHOUSE],
    tabs: [
      { label: "Stock", fullLabel: "Historial de stock", href: "/historial-stock/" },
      { label: "Precios", fullLabel: "Historial de cambio de precios", href: "/historial-precios/" },
    ],
  },
  billing: {
    label: "Facturación",
    tabs: [
      { label: "Mi plan", fullLabel: "Mi plan actual", href: "/mi-plan-actual/" },
      { label: "Pagos", fullLabel: "Historial de pagos", href: "/pagos/" },
      { label: "Suscripciones", fullLabel: "Suscripciones", href: "/suscripciones/" },
    ],
  },
  audit: {
    label: "Auditoría",
    tabs: [
      { label: "Productos", fullLabel: "Auditoría de productos", href: "/auditoria-productos/" },
      { label: "Transacciones", fullLabel: "Auditoría de transacciones", href: "/auditoria-transacciones/" },
    ],
  },
};

/** Sección (con su `id`) a la que pertenece una ruta en la vista del usuario, o `null`. */
export const getSectionByPath = (user, pathname) => {
  const path = normalizePath(pathname);
  const view = getViewType(user);
  const entry = Object.entries(SECTIONS).find(([, { tabs, views }]) =>
    (!views || views.includes(view)) && tabs.some((tab) => tab.href === path));
  return entry ? { id: entry[0], ...entry[1] } : null;
};

/** Pestañas de la sección que el usuario puede abrir. */
export const getAccessibleTabs = (user, section) =>
  section.tabs.filter((tab) => canAccessRoute(user, tab.href));
