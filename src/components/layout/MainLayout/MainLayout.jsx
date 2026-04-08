import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  CssBaseline,
  Toolbar,
  IconButton,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import UpdatesModal from "../../ui/UpdatesModal/UpdatesModal";
import { getUserData } from "../../../api/utils";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import StoreIcon from "@mui/icons-material/Store";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PaymentsIcon from "@mui/icons-material/Payments";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import SyncIcon from "@mui/icons-material/Sync";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";
import PolicyIcon from "@mui/icons-material/Policy";
import BarChartIcon from "@mui/icons-material/BarChart";
import logo from "../../../assets/images/logo.jpg";
import { colors } from "../../../theme/colors";
import PageHelp from "../../ui/PageHelp/PageHelp";
import NotificationsMenu from "../../ui/NotificationsMenu/NotificationsMenu";
import PendingMenu from "../../ui/PendingMenu/PendingMenu";
import DuplicateSalesMenu from "../../ui/DuplicateSalesMenu/DuplicateSalesMenu";
import StockRequestMenu from "../../ui/StockRequestMenu/StockRequestMenu";

const iconMap = {
  Vender: <ShoppingCartIcon />,
  Ventas: <ReceiptIcon />,
  Clientes: <PersonSearchIcon />,
  Dashboard: <BarChartIcon />,
  Tienda: <LocalShippingIcon />,
  Distribuciones: <LocalShippingIcon />,
  Traspasos: <SwapHorizIcon />,
  Movimientos: <SwapHorizIcon />,
  Caja: <PointOfSaleIcon />,
  Productos: <InventoryIcon />,
  Tiendas: <StoreIcon />,
  Vendedores: <EngineeringIcon />,
  Mensualidades: <PaymentsIcon />,
  Logs: <DescriptionIcon />,
  Servicios: <MiscellaneousServicesIcon />,
  Sincronizar: <SyncIcon />,
  Distribuir: <LocalShippingIcon />,
  Auditoria: <PolicyIcon />,
};

const drawerWidth = 256;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: 280,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: 280,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(8)} + 1px)`,
});

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], { duration: 280, easing: theme.transitions.easing.sharp }),
  background: colors.gradient.appbar,
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => {
  const paperBase = {
    background: colors.gradient.sidebar,
    color: "#fff",
    borderRight: "none",
    display: "flex",
    flexDirection: "column",
  };
  return {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": { ...openedMixin(theme), ...paperBase },
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": { ...closedMixin(theme), ...paperBase },
    }),
  };
});

export default function MainLayout({ toggleTheme, themeMode, onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserData();

  const accent = '#a78bfa';

  const [open, setOpen] = React.useState(false);
  const [openMenus, setOpenMenus] = React.useState({});
  const [showUpdates, setShowUpdates] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  React.useEffect(() => {
    if (onLoginSuccess) {
      setShowUpdates(true);
    }
  }, [onLoginSuccess]);

  if (!user) {
    return null;
  }

  const handleDrawerToggle = () => {
    setOpen(!open);
    if (open) setOpenMenus({});
  };

  const handleToggleMenu = (label) => {
    setOpen(true);
    setOpenMenus((prev) => ({ [label]: !prev[label] }));
  };


  const handleBack = () => {
    const updatedUser = { ...user, store_type: "", store_name: "", store_id: null };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("store-changed"));
    navigate("/tiendas/", { replace: true });
  };

  const isActive = (href) => location.pathname === href;

  const currentHour = new Date().getHours();
  const isDashboardRestricted = user && user.store_count > 1 && currentHour >= 10 && currentHour < 21;

  const linksByType = {
    T: [
      { label: "Vender", href: "/vender/" },
      {
        label: "Ventas",
        dropdown: [
          { label: "Ventas", href: "/ventas/" },
          { label: "Importar ventas", href: "/importar-ventas/", hidden: user.role === "seller" },
        ],
      },
      {
        label: "Caja",
        dropdown: [
          { label: "Corte de caja", href: "/corte-caja/", hidden: user.role === "seller" },
          { label: "Movimientos en caja", href: "/movimientos-caja/" },
        ],
      },
      { label: "Clientes", href: "/clientes/", hidden: user.role === "seller" },
      {
        label: "Productos",
        dropdown: [
          { label: "Productos", href: "/productos/", hidden: user.role === "seller" },
          { label: "Inventario", href: "/inventario/" },
          { divider: true, hidden: user.role === "seller" },
          { label: "Marcas", href: "/marcas/", hidden: user.role === "seller" },
          { label: "Departamentos", href: "/departamentos/", hidden: user.role === "seller" },
          { label: "Reasignación", href: "/reasignacion/", hidden: user.role === "seller" },
          { divider: true, hidden: user.role === "seller" },
          { label: "Importar Productos", href: "/importar-productos/", hidden: user.role === "seller" },
          { label: "Importar inventario", href: "/importar-inventario/", hidden: user.role === "seller" },
          { divider: true },
          { label: "Solicitudes de ajustes de stock", href: "/solicitudes-ajustes-stock/" },
        ],
      },
      {
        label: "Movimientos",
        dropdown: [
          { label: "Distribuciones", href: "/distribuciones/", hidden: user.role === "seller" },
          { label: "Traspasos", href: "/traspasos/" },
        ],
      },
      { label: "Historial de stock", href: "/historial-stock/", hidden: user.role === "seller" },
    ],
    A: [
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
          { divider: true },
          { label: "Marcas", href: "/marcas/" },
          { label: "Departamentos", href: "/departamentos/" },
          { divider: true },
          { label: "Importar Productos", href: "/importar-productos/" },
          { label: "Importar inventario", href: "/importar-inventario/" },
          { divider: true },
          { label: "Solicitudes de ajustes de stock", href: "/solicitudes-ajustes-stock/" },
        ],
      },
      { label: "Historial de stock", href: "/historial-stock/" },
    ],
    G: [
      {
        label: "Tableros",
        disabled: isDashboardRestricted,
        disabledMessage: "Disponible antes de las 10 AM y despues de las 9 PM",
        dropdown: [
          { label: "Ventas exitosas", href: "/tablero-ventas/" },
          { label: "Ventas ajustadas o canceladas", href: "/tablero-ventas-ajustadas-cancelaciones/" },
          { label: "Marcas y productos", href: "/tablero-productos/" },
        ],
      },
      { label: "Tiendas", href: "/tiendas/" },
      { label: "Clientes", href: "/clientes/" },
      { label: "Vendedores", href: "/vendedores/" },
      {
        label: "Productos",
        dropdown: [
          { label: "Productos", href: "/productos/" },
          { divider: true },
          { label: "Marcas", href: "/marcas/" },
          { label: "Departamentos", href: "/departamentos/" },
          { label: "Reasignación", href: "/reasignacion/" },
          { divider: true },
          { label: "Importar Productos", href: "/importar-productos/" },
          { divider: true },
          { label: "Solicitudes de ajustes de stock", href: "/solicitudes-ajustes-stock/" },
        ],
      },
      {
        label: "Auditoria",
        dropdown: [
          { label: "Productos", href: "/auditoria-productos/" },
          { label: "Transacciones", href: "/auditoria-transacciones/" },
        ],
      },
      { label: "Mensualidades", href: "/pagos/" },
      { label: "Servicios", href: "/servicios/" },
      { label: "Sincronizar", href: "/sincronizar/" },
    ],
  };

  const type = user.store_type === "T" ? "T" : user.store_type === "A" ? "A" : "G";
  const menuItems = linksByType[type];

  const activeSx = {
    background: `${accent}26`,
    "&:hover": { background: `${accent}33` },
  };

  return (
    <Box sx={{ display: "flex", overflow: "hidden" }}>
      <CssBaseline />

      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ minHeight: "60px !important" }}>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: "-0.01em" }}>
            {user.store_name ? `${user.tenant_name} - ${user.store_name}` : user.tenant_name}
          </Typography>
          {user.role === "owner" && user.store_id && (
            <IconButton color="inherit" onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <PendingMenu />
          <DuplicateSalesMenu />
          <StockRequestMenu />
          <NotificationsMenu />
          <PageHelp />
          <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
            {themeMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Avatar
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              width: 34, height: 34,
              bgcolor: `${accent}d9`,
              color: "#fff",
              fontSize: "0.85rem", fontWeight: 700, mr: 1, cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { transform: "scale(1.1)", bgcolor: accent },
            }}
          >
            {(user?.store_name || user?.tenant_name || "U").charAt(0).toUpperCase()}
          </Avatar>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => { setAnchorEl(null); navigate("/perfil"); }}>
              <ListItemIcon><PersonSearchIcon fontSize="small" /></ListItemIcon>
              Perfil
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); navigate("/", { replace: true }); localStorage.removeItem("user"); window.location.reload(); }}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader
          sx={{
            display: "flex", alignItems: "center", justifyContent: "center",
            minHeight: "60px !important",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {open && (
            <a href="https://smartventa-pos.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Box component="img" src={logo} alt="SmartVenta"
                sx={{ height: "38px", width: "auto", objectFit: "contain", borderRadius: 1, cursor: "pointer" }}
              />
            </a>
          )}
        </DrawerHeader>

        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.06)" }} />

        <List sx={{
          pt: 1.5, px: 1, flex: 1, overflowY: "auto", overflowX: "hidden",
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "4px" },
        }}>
          {menuItems.map((item, idx) => {
            if (item.hidden) return null;

            if (item.dropdown) {
              return (
                <React.Fragment key={idx}>
                  <ListItem disablePadding sx={{ mb: 0.3 }}>
                    <ListItemButton
                      onClick={() => !item.disabled && handleToggleMenu(item.label)}
                      disabled={item.disabled}
                      sx={{
                        borderRadius: "10px", py: 1,
                        justifyContent: open ? "initial" : "center",
                        "&:hover": { backgroundColor: item.disabled ? "transparent" : "rgba(255,255,255,0.08)" },
                      }}
                    >
                      <ListItemIcon sx={{ color: item.disabled ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.7)", minWidth: open ? 38 : 0, justifyContent: "center" }}>
                        {iconMap[item.label] || <DashboardIcon />}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        secondary={item.disabled && open ? item.disabledMessage : null}
                        primaryTypographyProps={{ fontWeight: 600, fontSize: "0.8rem" }}
                        secondaryTypographyProps={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      {open && !item.disabled && (openMenus[item.label] ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />)}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={openMenus[item.label]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.dropdown.map((sub, i) =>
                        sub.divider || sub.hidden ? null : (
                          <ListItemButton key={i} onClick={() => navigate(sub.href)}
                            sx={{
                              pl: 6.5, py: 0.6, borderRadius: "8px", my: 0.2, mx: 0.5,
                              ...(isActive(sub.href) ? activeSx : {}),
                              "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
                            }}
                          >
                            <ListItemText primary={sub.label}
                              primaryTypographyProps={{
                                fontSize: "0.75rem",
                                color: isActive(sub.href) ? accent : "rgba(255,255,255,0.75)",
                                fontWeight: isActive(sub.href) ? 600 : 400,
                              }}
                            />
                          </ListItemButton>
                        )
                      )}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            }

            return (
              <ListItem key={idx} disablePadding sx={{ mb: 0.3 }}>
                <ListItemButton onClick={() => navigate(item.href)}
                  sx={{
                    borderRadius: "10px", py: 1,
                    justifyContent: open ? "initial" : "center",
                    ...(isActive(item.href) ? activeSx : {}),
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
                  }}
                >
                  <ListItemIcon sx={{
                    color: isActive(item.href) ? accent : "rgba(255,255,255,0.7)",
                    minWidth: open ? 38 : 0, justifyContent: "center",
                  }}>
                    {iconMap[item.label] || <DashboardIcon />}
                  </ListItemIcon>
                  <ListItemText primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 600, fontSize: "0.8rem",
                      color: isActive(item.href) ? accent : "inherit",
                    }}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Box sx={{ mt: "auto", p: 1 }}>
          <ListItemButton
            onClick={() => setShowUpdates(true)}
            sx={{
              borderRadius: 2, justifyContent: open ? "initial" : "center", mb: 1,
              "&:hover": { backgroundColor: "rgba(167, 139, 250, 0.12)" },
            }}
          >
            <ListItemIcon sx={{ color: "#a78bfa", minWidth: open ? 38 : 0, justifyContent: "center" }}>
              <NewspaperIcon />
            </ListItemIcon>
            <ListItemText primary="Actualizaciones 2026" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.8rem" }} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
          <ListItemButton
            component="a"
            href={`https://api.whatsapp.com/send/?phone=${process.env.REACT_APP_WHATSAPP_NUMBER}&text=${encodeURIComponent(`Soporte SmartVenta\nTenant: ${user.tenant_name}\nTienda: ${user.store_name || "General"}`)}&type=phone_number&app_absent=0`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              borderRadius: 2, justifyContent: open ? "initial" : "center",
              "&:hover": { backgroundColor: "rgba(37, 211, 102, 0.12)" },
            }}
          >
            <ListItemIcon sx={{ color: "#25D366", minWidth: open ? 38 : 0, justifyContent: "center" }}>
              <WhatsAppIcon />
            </ListItemIcon>
            <ListItemText primary="Soporte" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.8rem" }} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto", maxWidth: "100%" }}>
        <DrawerHeader />
        <UpdatesModal open={showUpdates} onClose={() => setShowUpdates(false)} />
        <Outlet />
      </Box>
    </Box>
  );
}
