import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import StoreIcon from "@mui/icons-material/Store";
import EngineeringIcon from "@mui/icons-material/Engineering";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import SyncIcon from "@mui/icons-material/Sync";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PolicyIcon from "@mui/icons-material/Policy";
import BarChartIcon from "@mui/icons-material/BarChart";
import HistoryIcon from "@mui/icons-material/History";
import { STORE_TYPES } from "../../../constants";
import {
  canAccessRoute,
  getViewType,
  isOwner,
  isSeller,
  isSalesDashboardRestricted,
  SALES_DASHBOARD_PATH,
  SALES_DASHBOARD_RESTRICTION_MESSAGE,
} from "../../../constants/routeAccess";

export const MENU_ACTIONS = {
  STORE_SELECTOR: "store-selector",
  GO_BACK: "go-back",
};

/** Etiqueta del selector de sucursal; también es la llave de su submenú en `openMenus`. */
export const STORE_SELECTOR_LABEL = "Tienda";

const ICONS = {
  Vender: ShoppingCartIcon,
  Ventas: ReceiptIcon,
  Clientes: PersonSearchIcon,
  Tableros: BarChartIcon,
  [STORE_SELECTOR_LABEL]: LocalShippingIcon,
  Distribuciones: LocalShippingIcon,
  Traspasos: SwapHorizIcon,
  Movimientos: SwapHorizIcon,
  Caja: PointOfSaleIcon,
  Productos: InventoryIcon,
  Tiendas: StoreIcon,
  Vendedores: EngineeringIcon,
  Servicios: MiscellaneousServicesIcon,
  Sincronizar: SyncIcon,
  Distribuir: LocalShippingIcon,
  "Auditoría": PolicyIcon,
  Facturación: ReceiptIcon,
  Regresar: ArrowBackIcon,
  "Historial de stock": HistoryIcon,
};

export const getMenuIcon = (label) => {
  const Icon = ICONS[label] || DashboardIcon;
  return <Icon />;
};

const buildStoreSwitcher = (user, stores) => {
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

// Qué rutas ve cada rol se define en constants/routeAccess.js (filterMenu).
// Aquí solo vive la estructura del menú; `hidden` decide la presentación
// (el vendedor ve accesos directos en lugar de submenús).
const buildLinksByType = (user, storeSwitcher) => {
  const seller = isSeller(user);
  return {
    [STORE_TYPES.STORE]: [
      ...storeSwitcher,
      { label: "Vender", href: "/vender/" },
      {
        label: "Ventas",
        dropdown: [
          { label: "Ventas", href: "/ventas/" },
          { label: "Apartados", href: "/apartados/" },
          { label: "Importar ventas", href: "/importar-ventas/" },
        ],
        hidden: seller,
      },
      {
        label: "Caja",
        dropdown: [
          { label: "Corte de caja", href: "/corte-caja/" },
          { label: "Movimientos en caja", href: "/movimientos-caja/" },
        ],
        hidden: seller,
      },
      { label: "Clientes", href: "/clientes/" },
      {
        label: "Productos",
        dropdown: [
          { label: "Productos", href: "/productos/" },
          { label: "Inventario", href: "/inventario/" },
          { label: "Conversiones", href: "/conversiones/" },
          { label: "Marcas", href: "/marcas/" },
          { label: "Departamentos", href: "/departamentos/" },
          { label: "Reasignación", href: "/reasignacion/" },
          { label: "Importar productos", href: "/importar-productos/" },
          { label: "Importar inventario", href: "/importar-inventario/" },
          { label: "Solicitudes de ajustes de stock", href: "/solicitudes-ajustes-stock/" },
          { label: "Historial de cambio de precios", href: "/historial-precios/" },
        ],
      },
      {
        label: "Auditoría",
        dropdown: [
          { label: "Inventario a verificar", href: "/auditoria-inventario/" },
        ],
      },
      {
        label: "Movimientos",
        dropdown: [
          { label: "Distribuciones", href: "/distribuciones/" },
          { label: "Traspasos", href: "/traspasos/" },
        ],
        hidden: seller,
      },
      { label: "Ventas", href: "/ventas/", hidden: !seller },
      { label: "Apartados", href: "/apartados/", hidden: !seller },
      { label: "Movimientos en caja", href: "/movimientos-caja/", hidden: !seller },
      { label: "Traspasos", href: "/traspasos/", hidden: !seller },
      { label: "Historial de stock", href: "/historial-stock/" },
    ],
    [STORE_TYPES.WAREHOUSE]: [
      ...storeSwitcher,
      { label: "Distribuir", href: "/distribuir/" },
      {
        label: "Movimientos",
        dropdown: [
          { label: "Distribuciones", href: "/distribuciones/" },
          { label: "Traspasos", href: "/traspasos/" },
        ],
      },
      {
        label: "Productos",
        dropdown: [
          { label: "Productos", href: "/productos/" },
          { label: "Inventario", href: "/inventario/" },
          { label: "Marcas", href: "/marcas/" },
          { label: "Departamentos", href: "/departamentos/" },
          { label: "Importar productos", href: "/importar-productos/" },
          { label: "Importar inventario", href: "/importar-inventario/" },
          { label: "Solicitudes de ajustes de stock", href: "/solicitudes-ajustes-stock/" },
          { label: "Historial de cambio de precios", href: "/historial-precios/" },
        ],
      },
      {
        label: "Auditoría",
        dropdown: [
          { label: "Inventario a verificar", href: "/auditoria-inventario/" },
        ],
      },
      { label: "Historial de stock", href: "/historial-stock/" },
    ],
    [STORE_TYPES.GENERAL]: [
      {
        label: "Tableros",
        dropdown: [
          { label: "Ventas exitosas", href: SALES_DASHBOARD_PATH, disabled: isSalesDashboardRestricted(user), disabledMessage: SALES_DASHBOARD_RESTRICTION_MESSAGE },
          { label: "Ventas canceladas", href: "/tablero-ventas-ajustadas-cancelaciones/" },
          { label: "Verificación de stock", href: "/tablero-verificacion-stock/" },
          { label: "Marcas y productos", href: "/tablero-productos/" },
          { label: "Traspasos pendientes", href: "/tablero-traspasos-pendientes/" },
        ],
      },
      { label: "Tiendas", href: "/tiendas/" },
      { label: "Clientes", href: "/clientes/" },
      { label: "Vendedores", href: "/vendedores/" },
      {
        label: "Productos",
        dropdown: [
          { label: "Productos", href: "/productos/" },
          { label: "Conversiones", href: "/conversiones/" },
          { label: "Marcas", href: "/marcas/" },
          { label: "Departamentos", href: "/departamentos/" },
          { label: "Reasignación", href: "/reasignacion/" },
          { label: "Importar productos", href: "/importar-productos/" },
          { label: "Solicitudes de ajustes de stock", href: "/solicitudes-ajustes-stock/" },
          { label: "Historial de cambio de precios", href: "/historial-precios/" },
        ],
      },
      {
        label: "Auditoría",
        dropdown: [
          { label: "Productos", href: "/auditoria-productos/" },
          { label: "Transacciones", href: "/auditoria-transacciones/" },
        ],
      },
      {
        label: "Facturación",
        dropdown: [
          { label: "Mi plan actual", href: "/mi-plan-actual/" },
          { label: "Historial de pagos", href: "/pagos/" },
          { label: "Suscripciones", href: "/suscripciones/" },
        ],
      },
      { label: "Servicios", href: "/servicios/" },
      { label: "Sincronizar", href: "/sincronizar/" },
    ],
  };
};

// Quita lo que el usuario no puede abrir y los submenús que quedan vacíos.
const filterMenu = (user, items) => items.flatMap((item) => {
  if (item.hidden) return [];
  if (item.action) return [item];
  if (item.dropdown) {
    const dropdown = item.dropdown.filter((sub) => canAccessRoute(user, sub.href));
    return dropdown.length ? [{ ...item, dropdown }] : [];
  }
  return canAccessRoute(user, item.href) ? [item] : [];
});

/**
 * Menú lateral para el usuario y la vista actual (tienda, almacén o general),
 * ya filtrado por permisos. `stores` llena el selector de sucursal del dueño.
 */
export const buildMenu = (user, { stores = [] } = {}) => {
  const linksByType = buildLinksByType(user, buildStoreSwitcher(user, stores));
  return filterMenu(user, linksByType[getViewType(user)]);
};
