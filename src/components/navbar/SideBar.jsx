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
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
  background: '#04356b',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.14), 0 7px 10px -5px rgba(4,53,107,0.4)',
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
      background: '#04356b',
      color: '#fff',
      borderRight: 'none',
      position: 'relative',
      paddingBottom: '140px', // Space for user section
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      background: '#04356b',
      color: '#fff',
      borderRight: 'none',
      position: 'relative',
      paddingBottom: '80px', // Space for user section when closed
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
        <Toolbar sx={{ minHeight: '64px !important' }}>
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
            SmartVenta
          </Typography>

          <Typography 
            variant="body2" 
            sx={{ 
              mr: 2,
              color: 'rgba(255,255,255,0.9)'
            }}
          >
            {user.store_name || user.tenant_name}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* DRAWER */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: 'rgba(0,0,0,0.2)',
            minHeight: '64px !important',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              textAlign: "center",
              color: 'white',
              letterSpacing: '0.5px',
            }}
          >
            MENÚ
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
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }
                      }}
                    >
                      <ListItemIcon sx={{ color: '#8fb3ff', minWidth: 40 }}>
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
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: '#8fb3ff', minWidth: 40 }}>
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

        {/* USER SECTION AT BOTTOM */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0,
          p: 2,
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            mb: 2,
            p: 1,
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.08)',
            }
          }}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                bgcolor: '#8fb3ff',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              {(user.store_name || user.tenant_name || 'U').charAt(0).toUpperCase()}
            </Avatar>
            {open && (
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'white',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {user.store_name || user.tenant_name}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.6)',
                    display: 'block'
                  }}
                >
                  {user.role === 'owner' ? 'Propietario' : user.role === 'seller' ? 'Vendedor' : 'Usuario'}
                </Typography>
              </Box>
            )}
          </Box>

          {open && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {user.role === "owner" && user.store_id && (
                <IconButton
                  size="small"
                  onClick={handleBack}
                  sx={{
                    flex: 1,
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.15)',
                    }
                  }}
                >
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={handleLogout}
                sx={{
                  flex: 1,
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                  }
                }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* CONTENIDO */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto", maxWidth: "100%" }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
