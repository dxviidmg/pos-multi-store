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
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Outlet, useNavigate } from "react-router-dom";
import { getUserData } from "../../api/utils";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import StoreIcon from "@mui/icons-material/Store";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PaymentsIcon from "@mui/icons-material/Payments";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SyncIcon from "@mui/icons-material/Sync";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";

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
  
  // Productos e inventario
  Productos: <InventoryIcon />,
  
  // Administración
  Tiendas: <StoreIcon />,
  Vendedores: <EngineeringIcon />,
  Mensualidades: <PaymentsIcon />,
  
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
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.14), 0 7px 10px -5px rgba(102,126,234,0.4)',
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
      background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 100%)',
      color: '#fff',
      borderRight: 'none',
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 100%)',
      color: '#fff',
      borderRight: 'none',
    },
  }),
}));

export default function MainLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = getUserData();

  const [open, setOpen] = React.useState(false);
  const [openMenus, setOpenMenus] = React.useState({});

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleToggleMenu = (label) => {
    setOpen(true)
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
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
      { label: "Clientes", href: "/clientes/", hidden: user.role === "seller" },
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
          { label: "Marcas", href: "/marcas/" },
          { label: "Departamentos", href: "/departamentos/" },
          { label: "Reasignación", href: "/reasignacion/" },
          { divider: true },
          { label: "Productos", href: "/productos/" },
          { label: "Importar Productos", href: "/importar-productos/" },
          { divider: true },
          { label: "Inventario", href: "/inventario/" },
          { label: "Importar inventario", href: "/importar-inventario/" },
          { divider: true },
          { label: "Logs", href: "/logs/" },
        ],
      },
      {
        label: "Ventas",
        dropdown: [
          {
            label: "Corte de caja",
            href: "/corte-caja/",
            hidden: user.role === "seller",
          },
          {
            label: "Movimientos",
            href: "/movimientos/",
            hidden: user.role === "seller",
          },
          { label: "Ventas", href: "/ventas/" },
          { divider: true },
          { label: "Importar ventas", href: "/importar-ventas/" },
        ],
      },
    ],
    A: [
      { label: "Distribuir", href: "/distribuir/" },
      {
        label: "Tienda",
        dropdown: [
          { label: "Distribuciones", href: "/distribuciones/" },
          { label: "Traspasos", href: "/traspasos/" },
        ],
      },
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

      {
        label: "Productos",
        dropdown: [
          { label: "Marcas", href: "/marcas/" },
          { label: "Departamentos", href: "/departamentos/" },
          { label: "Reasignación", href: "/reasignacion/" },
          { divider: true },
          { label: "Productos", href: "/productos/" },
          { label: "Importar Productos", href: "/importar-productos/" },
        ],
      },

      { label: "Vendedores", href: "/vendedores/" },
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
        <Toolbar sx={{ minHeight: '70px !important' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography 
            variant="h5" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              letterSpacing: '0.5px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            💼 SmartVenta
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '8px 16px',
            borderRadius: '20px',
          }}>
            <Typography sx={{ fontWeight: 500 }}>
              {user.store_name || user.tenant_name}
            </Typography>

            {user.role === "owner" && user.store_id && (
              <IconButton 
                size="small" 
                onClick={handleBack}
                sx={{ 
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                }}
              >
                ↩️
              </IconButton>
            )}

            <Divider orientation="vertical" flexItem sx={{ backgroundColor: 'rgba(255,255,255,0.3)', mx: 1 }} />

            <IconButton 
              onClick={handleLogout}
              sx={{ 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
              }}
            >
              🚪
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* DRAWER */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '70px !important',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              textAlign: "center",
              color: 'white',
              letterSpacing: '1px',
            }}
          >
            📋 MENÚ
          </Typography>
        </DrawerHeader>

        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />

        <List sx={{ pt: 2 }}>
          {menuItems.map((item, idx) => {
            if (item.hidden) return null;

            if (item.dropdown) {
              return (
                <React.Fragment key={idx}>
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => handleToggleMenu(item.label)}
                      sx={{
                        borderRadius: '12px',
                        mx: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(102, 126, 234, 0.2)',
                        }
                      }}
                    >
                      <ListItemIcon sx={{ color: '#a8b3ff', minWidth: 40 }}>
                        {iconMap[item.label] || <DashboardIcon />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: '0.95rem'
                        }}
                      />
                      {openMenus[item.label] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>

                  <Collapse
                    in={openMenus[item.label]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.dropdown.map((sub, i) =>
                        sub.divider ? (
                          <Divider key={i} sx={{ ml: 4, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                        ) : sub.hidden ? null : (
                          <ListItemButton
                            key={i}
                            sx={{ 
                              pl: 6,
                              borderRadius: '8px',
                              mx: 2,
                              my: 0.3,
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.15)',
                              }
                            }}
                            onClick={() => navigate(sub.href)}
                          >
                            <ListItemText 
                              primary={sub.label}
                              primaryTypographyProps={{
                                fontSize: '0.875rem',
                                color: 'rgba(255,255,255,0.8)'
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
              <ListItem key={idx} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton 
                  onClick={() => navigate(item.href)}
                  sx={{
                    borderRadius: '12px',
                    mx: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: '#a8b3ff', minWidth: 40 }}>
                    {iconMap[item.label] || <DashboardIcon />}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '0.95rem'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* CONTENIDO */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto", maxWidth: "100%" }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
