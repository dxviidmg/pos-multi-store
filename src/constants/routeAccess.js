/**
 * Fuente única de permisos por ruta. La usan tanto el guard de rutas (App.js)
 * como el menú lateral (MainLayout), para que lo que se ve en el menú y lo que
 * se puede abrir por URL no se desincronicen.
 *
 * Vistas: "T" = tienda, "A" = almacén, "G" = vista general (sin tienda seleccionada).
 * Roles: "owner", "seller"; cualquier otro rol se trata como "admin".
 * Cada ruta indica, por vista, qué roles pueden entrar. Una regla con
 * `multistore: true` además exige que el negocio tenga varias sucursales.
 */

const ALL = ["owner", "admin", "seller"];
const STAFF = ["owner", "admin"];
const OWNER = ["owner"];

const multistore = (roles) => ({ roles, multistore: true });

export const SALES_DASHBOARD_PATH = "/tablero-ventas/";

export const ROUTE_ACCESS = {
  // Tienda
  "/vender/": { T: ALL },
  "/ventas/": { T: ALL },
  "/apartados/": { T: ALL },
  "/importar-ventas/": { T: STAFF },
  "/corte-caja/": { T: STAFF },
  "/movimientos-caja/": { T: ALL },

  // Almacén
  "/distribuir/": { A: ALL },

  // Movimientos entre sucursales
  "/distribuciones/": { T: multistore(STAFF), A: ALL },
  "/traspasos/": { T: multistore(ALL), A: ALL },

  // Productos e inventario
  "/productos/": { T: STAFF, A: ALL, G: OWNER },
  "/inventario/": { T: STAFF, A: ALL },
  "/conversiones/": { T: STAFF, G: OWNER },
  "/marcas/": { T: STAFF, A: ALL, G: OWNER },
  "/departamentos/": { T: STAFF, A: ALL, G: OWNER },
  "/reasignacion/": { T: STAFF, G: OWNER },
  "/importar-productos/": { T: STAFF, A: ALL, G: OWNER },
  "/importar-inventario/": { T: STAFF, A: ALL },
  "/solicitudes-ajustes-stock/": { T: STAFF, A: ALL, G: OWNER },
  "/historial-precios/": { T: STAFF, A: ALL, G: OWNER },
  "/auditoria-inventario/": { T: STAFF, A: STAFF },
  "/historial-stock/": { T: STAFF, A: STAFF },

  // Clientes
  "/clientes/": { T: STAFF, G: OWNER },

  // Vista general (solo owner)
  [SALES_DASHBOARD_PATH]: { G: OWNER },
  "/tablero-ventas-ajustadas-cancelaciones/": { G: OWNER },
  "/tablero-verificacion-stock/": { G: OWNER },
  "/tablero-productos/": { G: OWNER },
  "/tablero-traspasos-pendientes/": { G: multistore(OWNER) },
  "/tiendas/": { G: OWNER },
  "/vendedores/": { G: OWNER },
  "/auditoria-productos/": { G: OWNER },
  "/auditoria-transacciones/": { G: OWNER },
  "/mi-plan-actual/": { G: OWNER },
  "/pagos/": { G: OWNER },
  "/suscripciones/": { G: OWNER },
  "/servicios/": { G: OWNER },
  "/sincronizar/": { G: OWNER },

  // Todos
  "/perfil/": { T: ALL, A: ALL, G: ALL },
};

export const getViewType = (user) =>
  user?.store_type === "T" || user?.store_type === "A" ? user.store_type : "G";

const getRole = (user) =>
  user?.role === "owner" || user?.role === "seller" ? user.role : "admin";

export const normalizePath = (path) => (path.endsWith("/") ? path : `${path}/`);

export const canAccessRoute = (user, path) => {
  if (!user || !path) return false;
  const rule = ROUTE_ACCESS[normalizePath(path)]?.[getViewType(user)];
  if (!rule) return false;
  const { roles, multistore: requiresMultistore = false } = Array.isArray(rule) ? { roles: rule } : rule;
  if (requiresMultistore && !user.multistore) return false;
  return roles.includes(getRole(user));
};

export const getHomeRoute = (user) => {
  const view = getViewType(user);
  if (view === "A") return "/distribuir/";
  if (view === "T") return "/vender/";
  return getRole(user) === "owner" ? "/tiendas/" : "/perfil/";
};

/**
 * Negocios con varias sucursales (excepto el demo) no pueden ver el tablero de
 * ventas exitosas entre las 10:00 y las 20:59 (hora local).
 */
export const isSalesDashboardRestricted = (user) => {
  const hour = new Date().getHours();
  return !!user?.multistore && user.tenant_short_name !== "demo" && hour >= 10 && hour < 21;
};

export const SALES_DASHBOARD_RESTRICTION_MESSAGE = "Antes de 10 AM o después de 9 PM";
