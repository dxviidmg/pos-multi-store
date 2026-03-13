import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
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
  Badge,
  LinearProgress,
  Chip,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Outlet, useNavigate } from "react-router-dom";
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
import logo from "../../../assets/images/logo.jpg";
import { colors } from "../../../theme/colors";

const iconMap = {
  // Ventas y clientes
  Vender: <ShoppingCartIcon />,
  Ventas: <ReceiptIcon />,
  Clientes: <PersonSearchIcon />,

  // Dashboard y reportes
  Dashboard: <DashboardIcon />,

  // Tienda y logística
  Tienda: <LocalShippingIcon />,
  Distribuciones: <LocalShippingIcon />,
  Traspasos: <SwapHorizIcon />,
  Movimientos: <SwapHorizIcon />,
  Caja: <PointOfSaleIcon />,

  // Productos e inventario
  Productos: <InventoryIcon />,

  // Administración
  Tiendas: <StoreIcon />,
  Vendedores: <EngineeringIcon />,
  Mensualidades: <PaymentsIcon />,
  Logs: <DescriptionIcon />,

  // Servicios y sincronización
  Servicios: <MiscellaneousServicesIcon />,
  Sincronizar: <SyncIcon />,
};

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
});

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"]),
  background: colors.primary,
  boxShadow: colors.shadow.light,
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      background: colors.primary,
      color: "#fff",
      borderRight: "none",
      boxShadow: colors.shadow.medium,
      display: "flex",
      flexDirection: "column",
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      background: colors.primary,
      color: "#fff",
      borderRight: "none",
      boxShadow: colors.shadow.medium,
      display: "flex",
      flexDirection: "column",
    },
  }),
}));

export default function MainLayout({ toggleTheme, themeMode }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = getUserData();

  const [open, setOpen] = React.useState(false);
  const [openMenus, setOpenMenus] = React.useState({});

  const handleDrawerToggle = () => {
    setOpen(!open);
    if (open) {
      setOpenMenus({});
    }
  };

  const handleToggleMenu = (label) => {
    setOpen(true);
    setOpenMenus((prev) => {
      const newState = {};
      newState[label] = !prev[label];
      return newState;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleBack = () => {
    const updatedUser = {
      ...user,
      store_type: "",
      store_name: "",
      store_id: "",
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    navigate("/tiendas/", { replace: true });
  };

  // ===============================
  // MENU DINÁMICO
  // ===============================

  const linksByType = {
    T: [
      { label: "Vender", href: "/vender/" },
      {
        label: "Ventas",
        dropdown: [
          { label: "Ventas", href: "/ventas/" },
          {
            label: "Importar ventas",
            href: "/importar-ventas/",
            hidden: user.role === "seller",
          },
        ],
      },

      {
        label: "Caja",
        dropdown: [
          {
            label: "Corte de caja",
            href: "/corte-caja/",
            hidden: user.role === "seller",
          },
          {
            label: "Movimientos en caja",
            href: "/movimientos-caja/",
            hidden: user.role === "seller",
          },
        ],
      },
      { label: "Clientes", href: "/clientes/", hidden: user.role === "seller" },
      {
        label: "Productos",
        dropdown: [
          { label: "Productos", href: "/productos/" },
          { label: "Inventario", href: "/inventario/" },
          { divider: true },
          { label: "Marcas", href: "/marcas/" },
          { label: "Departamentos", href: "/departamentos/" },
          { label: "Reasignación", href: "/reasignacion/" },
          { divider: true },
          { label: "Importar Productos", href: "/importar-productos/" },
          { label: "Importar inventario", href: "/importar-inventario/" },
        ],
        hidden: user.role === "seller",
      },
      {
        label: "Movimientos",
        dropdown: [
          {
            label: "Distribuciones",
            href: "/distribuciones/",
            hidden: user.role === "seller",
          },
          { label: "Traspasos", href: "/traspasos/" },
        ],
      },
      { label: "Logs", href: "/logs/", hidden: user.role === "seller" },
    ],
    A: [
      { label: "Distribuir", href: "/distribuir/" },
      {
        label: "Tienda",
        dropdown: [
          { label: "Distribuciones", href: "/distribuciones/" },
          { label: "Traspasos", href: "/traspasos/" },
          { label: "Caja", href: "/cashflow/" },
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
        ],
      },
      { label: "Logs", href: "/logs/" },
    ],
    G: [
      {
        label: "Dashboard",
        dropdown: [
          { label: "General", href: "/tablero/" },
          { label: "Auditoria", href: "/auditoria/" },
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
        ],
      },
      { label: "Mensualidades", href: "/pagos/" },
      { label: "Servicios", href: "/servicios/" },
      { label: "Sincronizar", href: "/sincronizar/" },
    ],
  };

  const type =
    user.store_type === "T" ? "T" : user.store_type === "A" ? "A" : "G";

  const menuItems = linksByType[type];

  return (
    <Box sx={{ display: "flex", overflow: "hidden" }}>
      <CssBaseline />

      {/* APP BAR */}
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ minHeight: "64px !important" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
            }}
          >
            {user.store_name || user.tenant_name}
          </Typography>

          {user.role === "owner" && (
            <Avatar
              onClick={() => navigate("/tenant-profile")}
              sx={{
                width: 36,
                height: 36,
                bgcolor: "rgba(255,255,255,0.2)",
                fontSize: "0.9rem",
                fontWeight: "bold",
                mr: 1,
                cursor: "pointer",
              }}
            >
              {(user.store_name || user.tenant_name || "U")
                .charAt(0)
                .toUpperCase()}
            </Avatar>
          )}

          <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
            {themeMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {user.role === "owner" && user.store_id && (
            <IconButton color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          )}

          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* DRAWER */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            minHeight: "64px !important",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {open && (
            <Box
              component="img"
              src={logo}
              alt="SmartVenta"
              sx={{
                height: "40px",
                width: "auto",
                objectFit: "contain",
              }}
            />
          )}
        </DrawerHeader>

        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.08)" }} />

        <List
          sx={{
            pt: 1,
            px: 1,
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255,255,255,0.3)",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(0,0,0,0.1)",
            },
          }}
        >
          {menuItems.map((item, idx) => {
            if (item.hidden) return null;

            if (item.dropdown) {
              return (
                <React.Fragment key={idx}>
                  <ListItem disablePadding sx={{ mb: 0.4 }}>
                    <ListItemButton
                      onClick={() => handleToggleMenu(item.label)}
                      sx={{
                        borderRadius: "10px",
                        py: 0.96,
                        transition: "all 0.2s",
                        justifyContent: open ? "initial" : "center",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.12)",
                          transform: "translateX(2px)",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: "rgba(255,255,255,0.8)",
                          minWidth: open ? 40 : 0,
                          justifyContent: "center",
                        }}
                      >
                        {iconMap[item.label] || <DashboardIcon />}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          fontSize: "0.72rem",
                          letterSpacing: "0.24px",
                        }}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      {open &&
                        (openMenus[item.label] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        ))}
                    </ListItemButton>
                  </ListItem>

                  <Collapse
                    in={openMenus[item.label]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List
                      component="div"
                      disablePadding
                      sx={{
                        maxHeight: "300px",
                        overflow: "auto",
                        "&::-webkit-scrollbar": { width: "4px" },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "rgba(255,255,255,0.3)",
                          borderRadius: "4px",
                        },
                      }}
                    >
                      {item.dropdown.map((sub, i) =>
                        sub.divider ? null : sub.hidden ? null : (
                          <ListItemButton
                            key={i}
                            sx={{
                              pl: 7,
                              py: 0.64,
                              borderRadius: "8px",
                              my: 0.24,
                              transition: "all 0.2s",
                              "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                              },
                            }}
                            onClick={() => navigate(sub.href)}
                          >
                            <ListItemText
                              primary={sub.label}
                              primaryTypographyProps={{
                                fontSize: "0.68rem",
                                color: "rgba(255,255,255,0.85)",
                                fontWeight: 500,
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
              <ListItem key={idx} disablePadding sx={{ mb: 0.4 }}>
                <ListItemButton
                  onClick={() => navigate(item.href)}
                  sx={{
                    borderRadius: "10px",
                    py: 0.96,
                    transition: "all 0.2s",
                    justifyContent: open ? "initial" : "center",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.12)",
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      minWidth: open ? 40 : 0,
                      justifyContent: "center",
                    }}
                  >
                    {iconMap[item.label] || <DashboardIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 600,
                      fontSize: "0.72rem",
                      letterSpacing: "0.24px",
                    }}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* CONTENIDO */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, overflow: "auto", maxWidth: "100%" }}
      >
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
