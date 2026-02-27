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

const iconMap = {
  Vender: <ShoppingCartIcon />,
  Clientes: <PersonSearchIcon />,
  Dashboard: <DashboardIcon />,
  Distribuciones: <LocalShippingIcon />,
  Productos: <InventoryIcon />,
  Ventas: <ReceiptIcon />,
  Tiendas: <StoreIcon />,
  Vendedores: <EngineeringIcon />,
  Mensualidades: <PaymentsIcon />,
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
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
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
      { label: "Distribuciones", href: "/distribuciones/" },
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
      { label: "Distribuciones", href: "/distribuciones/" },
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
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SmartVenta
          </Typography>

          <Typography sx={{ mr: 2 }}>
            {user.store_name || user.tenant_name}
          </Typography>

          {user.role === "owner" && user.store_id && (
            <Typography sx={{ mr: 2, cursor: "pointer" }} onClick={handleBack}>
              Regresar
            </Typography>
          )}

          <Typography sx={{ cursor: "pointer" }} onClick={handleLogout}>
            Salir
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
  }}
>
  <Typography
    variant="h6"
    sx={{
      fontWeight: 600,
      textAlign: "center",
    }}
  >
    Menú
  </Typography>
</DrawerHeader>

        <Divider />

        <List>
          {menuItems.map((item, idx) => {
            if (item.hidden) return null;

            if (item.dropdown) {
              return (
                <React.Fragment key={idx}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleToggleMenu(item.label)}
                    >
                      <ListItemIcon>
                        {iconMap[item.label] || <DashboardIcon />}
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
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
                          <Divider key={i} sx={{ ml: 4 }} />
                        ) : sub.hidden ? null : (
                          <ListItemButton
                            key={i}
                            sx={{ pl: 6 }}
                            onClick={() => navigate(sub.href)}
                          >
                            <ListItemText primary={sub.label} />
                          </ListItemButton>
                        )
                      )}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            }

            return (
              <ListItem key={idx} disablePadding>
                <ListItemButton onClick={() => navigate(item.href)}>
                  <ListItemIcon>
                    {iconMap[item.label] || <DashboardIcon />}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
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
