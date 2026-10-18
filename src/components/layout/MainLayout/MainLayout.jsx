import { useCallback, useEffect, useRef, useState } from "react";
import { Box, CssBaseline, Backdrop, CircularProgress } from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { cleanCart } from "../../../redux/cart/cartActions";
import { useUser } from "../../../context/UserContext";
import { useSwitchStore } from "../../../hooks/useSwitchStore";
import { getStores } from "../../../api/stores";
import { logger } from "../../../utils/logger";
import { isSeller } from "../../../constants/routeAccess";
import { buildMenu, MENU_ACTIONS, STORE_SELECTOR_LABEL } from "./menuConfig";
import { DrawerHeader } from "./MainLayout.styles";
import SidebarDrawer from "./SidebarDrawer";
import SidebarMenu from "./SidebarMenu";
import AppHeader from "./AppHeader";
import SidebarFooter from "./SidebarFooter";
import { getSectionByPath } from "./menu-sections";

export default function MainLayout({ toggleTheme, themeMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { switchStore, backToGeneral, switching } = useSwitchStore();

  const [open, setOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
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

  const isActive = (href, sectionId) =>
    location.pathname === href || (!!sectionId && getSectionByPath(user, location.pathname)?.id === sectionId);

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

      <AppHeader
        user={user}
        open={open}
        themeMode={themeMode}
        onToggleDrawer={handleDrawerToggle}
        onToggleTheme={toggleTheme}
        onBack={backToGeneral}
        onLogout={performLogout}
      />

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
