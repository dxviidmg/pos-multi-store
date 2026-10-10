import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  IconButton,
  Typography,
  ListItemIcon,
  Avatar,
  Menu,
  MenuItem,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { cleanCart } from "../../../redux/cart/cartActions";
import { useUser } from "../../../context/UserContext";
import { useSwitchStore } from "../../../hooks/useSwitchStore";
import { getStores } from "../../../api/stores";
import { colors } from "../../../theme/colors";
import PageHelp from "../../ui/PageHelp/PageHelp";
import CustomTooltip from "../../ui/Tooltip";
import NotificationsMenu from "../../ui/NotificationsMenu/NotificationsMenu";
import PendingMenu from "../../ui/PendingMenu/PendingMenu";
import DuplicateSalesMenu from "../../ui/DuplicateSalesMenu/DuplicateSalesMenu";
import StockRequestMenu from "../../ui/StockRequestMenu/StockRequestMenu";
import { logger } from "../../../utils/logger";
import { isOwner, isSeller } from "../../../constants/routeAccess";
import { buildMenu, MENU_ACTIONS, STORE_SELECTOR_LABEL } from "./menuConfig";
import { AppBar, DrawerHeader, userMenuPaperSx } from "./MainLayout.styles";
import SidebarDrawer from "./SidebarDrawer";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

export default function MainLayout({ toggleTheme, themeMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { switchStore, backToGeneral, switching } = useSwitchStore();

  const [open, setOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [stores, setStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [previousStoreId, setPreviousStoreId] = useState(null);

  // Recuerda la sucursal anterior para mostrarla primero en el selector.
  const previousStoreIdRef = useRef(null);

  useEffect(() => {
    if (user?.store_id && user.store_id !== previousStoreIdRef.current) {
      const oldStoreId = previousStoreIdRef.current;
      previousStoreIdRef.current = user.store_id;
      if (oldStoreId) {
        setPreviousStoreId(oldStoreId);
      }
    }
  }, [user?.store_id]);

  // Limpieza del cierre de sesión: vacía la caché de React Query, el carrito de
  // Redux y borra el usuario del contexto.
  const performLogout = useCallback(() => {
    queryClient.clear();
    dispatch(cleanCart());
    logout();
    navigate("/");
  }, [queryClient, dispatch, logout, navigate]);

  if (!user) {
    return null;
  }

  const menuItems = buildMenu(user, { stores });

  const seller = isSeller(user);

  const handleDrawerToggle = () => {
    setOpen(!open);
    if (open) setOpenMenus({});
  };

  const handleDrawerClose = (event) => {
    if (event?.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setOpen(false);
  };

  const toggleSubmenu = (label, shouldOpenDrawer = false) => {
    if (shouldOpenDrawer) {
      setOpen(true);
    } else {
      setOpenMenus((prev) => ({ [label]: !prev[label] }));
    }
  };

  const loadStores = async () => {
    setLoadingStores(true);
    try {
      const response = await getStores();
      setStores(response.data || []);
    } catch (error) {
      logger.error("Error al obtener tiendas:", error);
      setStores([]);
    } finally {
      setLoadingStores(false);
    }
  };

  const handleToggleMenu = async (item, shouldOpenDrawer) => {
    if (item.action === MENU_ACTIONS.STORE_SELECTOR && !openMenus[item.label]) {
      await loadStores();
    }
    toggleSubmenu(item.label, shouldOpenDrawer);
  };

  const handleSelectStore = async (storeId) => {
    const closeStoreMenu = () => setOpenMenus({ [STORE_SELECTOR_LABEL]: false });
    if (storeId === user.store_id) {
      closeStoreMenu();
      return;
    }
    const selectedStore = stores.find((s) => s.id === storeId);
    if (!selectedStore) return;
    closeStoreMenu();
    await switchStore(selectedStore, { withOverlay: true });
  };

  const isActive = (href) => location.pathname === href;

  const closeUserMenu = () => setAnchorEl(null);

  const renderSidebar = (mobile) => {
    const expanded = mobile || open;
    return (
      <SidebarDrawer
        mobile={mobile}
        open={open}
        onClose={handleDrawerClose}
        footer={<SidebarFooter user={user} expanded={expanded} showSupport={!seller} onLogout={performLogout} />}
      >
        <SidebarMenu
          items={menuItems}
          expanded={expanded}
          openMenus={openMenus}
          isActive={isActive}
          storeName={user.store_name}
          storeSwitcher={{
            loading: loadingStores,
            currentStoreId: user.store_id,
            previousStoreId,
            onSelect: handleSelectStore,
          }}
          onToggleMenu={handleToggleMenu}
          onNavigate={navigate}
          onBack={backToGeneral}
        />
      </SidebarDrawer>
    );
  };

  return (
    <Box sx={{ display: "flex", overflowX: "hidden", height: "100vh" }}>
      <CssBaseline />

      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ minHeight: "60px !important", gap: { xs: 0.5, sm: 1 } }}>
          <CustomTooltip text="Menú" position="bottom">
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }} aria-label="Menú">
              <MenuIcon />
            </IconButton>
          </CustomTooltip>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: "-0.01em", fontSize: { xs: "0.95rem", sm: "1.25rem" }, display: { xs: open ? "none" : "block", sm: "block" } }}>
            {user.store_name ? `${user.tenant_name} - ${user.store_name}` : user.tenant_name}
          </Typography>

          {/* Mobile: Solo flecha regreso (si aplica) - ocultar cuando drawer abierto */}
          {isOwner(user) && user.store_id && (
            <Box sx={{ display: { xs: open ? "none" : "inline-flex", sm: "inline-flex" } }}>
              <CustomTooltip text="Regresar" position="bottom">
                <IconButton color="inherit" onClick={backToGeneral} aria-label="Regresar">
                  <ArrowBackIcon />
                </IconButton>
              </CustomTooltip>
            </Box>
          )}

          {/* Desktop + Mobile: menú de notificaciones unificado */}
          <Box sx={{ display: { xs: open ? "none" : "flex", lg: "flex" }, alignItems: "center", gap: { xs: 0, lg: 0.5 } }}>
            <PendingMenu />
            {!seller && (
              <>
                {/* Estos solo se muestran en desktop */}
                <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 0.5 }}>
                  <DuplicateSalesMenu />
                  <StockRequestMenu />
                </Box>
                <NotificationsMenu />
              </>
            )}
          </Box>

          {/* Ayuda - ocultar cuando drawer abierto en mobile */}
          <Box sx={{ display: { xs: open ? "none" : "inline-flex", sm: "inline-flex" } }}>
            <PageHelp />
          </Box>

          <Box sx={{ mr: 1, display: { xs: "none", sm: "inline-flex" } }}>
            <CustomTooltip text="Cambiar tema" position="bottom">
              <IconButton color="inherit" onClick={toggleTheme} aria-label="Cambiar tema">
                {themeMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </CustomTooltip>
          </Box>
          <Avatar
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              width: 34, height: 34,
              bgcolor: alpha(colors.googleBlue, 0.85),
              color: colors.white,
              fontSize: "0.85rem", fontWeight: 700, mr: 1, cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { transform: "scale(1.1)", bgcolor: colors.googleBlue },
              display: { xs: "none", sm: "flex" },
            }}
          >
            {(user.store_name || user.tenant_name || "U").charAt(0).toUpperCase()}
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeUserMenu}
            PaperProps={{ sx: userMenuPaperSx }}
          >
            <MenuItem onClick={() => { closeUserMenu(); navigate("/perfil"); }}>
              <ListItemIcon><PersonSearchIcon fontSize="small" /></ListItemIcon>
              Perfil
            </MenuItem>
            <MenuItem onClick={() => { closeUserMenu(); performLogout(); }}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer modal para mobile/tablets */}
      {renderSidebar(true)}

      {/* Drawer permanente para desktop */}
      {renderSidebar(false)}

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2, md: 3 }, minWidth: 0, overflowY: "auto", position: "relative" }}>
        <DrawerHeader />
        <Box key={`${location.pathname}-${user.store_id}`} className="page-enter">
          <Outlet />
        </Box>
      </Box>

      <Backdrop
        sx={{ color: "common.white", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={switching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
