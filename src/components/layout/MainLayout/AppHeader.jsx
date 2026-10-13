import { useState } from "react";
import {
  Toolbar,
  IconButton,
  Typography,
  ListItemIcon,
  Avatar,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { colors } from "../../../theme/colors";
import PageHelp from "../../ui/PageHelp/PageHelp";
import CustomTooltip from "../../ui/Tooltip";
import NotificationsMenu from "../../ui/NotificationsMenu/NotificationsMenu";
import PendingMenu from "../../ui/PendingMenu/PendingMenu";
import DuplicateSalesMenu from "../../ui/DuplicateSalesMenu/DuplicateSalesMenu";
import StockRequestMenu from "../../ui/StockRequestMenu/StockRequestMenu";
import { isOwner, isSeller } from "../../../constants/routeAccess";
import { AppBar, userMenuPaperSx } from "./MainLayout.styles";

/** Barra superior: menú, nombre del negocio, avisos, ayuda, tema y menú del usuario. */
const AppHeader = ({ user, open, themeMode, onToggleDrawer, onToggleTheme, onBack, onLogout }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const seller = isSeller(user);

  const closeUserMenu = () => setAnchorEl(null);

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar sx={{ minHeight: "60px !important", gap: { xs: 0.5, sm: 1 } }}>
        <CustomTooltip text="Menú" position="bottom">
          <IconButton color="inherit" edge="start" onClick={onToggleDrawer} sx={{ mr: 2 }} aria-label="Menú">
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
              <IconButton color="inherit" onClick={onBack} aria-label="Regresar">
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
            <IconButton color="inherit" onClick={onToggleTheme} aria-label="Cambiar tema">
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
          <MenuItem onClick={() => { closeUserMenu(); onLogout(); }}>
            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
