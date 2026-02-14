import React from "react";
import {
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../apis/utils";

export default function PrimarySearchAppBar({ onMenuClick }) {
  const navigate = useNavigate();
  const user = getUserData();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
    navigate("/tiendas/");
    window.location.reload();
  };

  return (
    <>
      <Toolbar>
        {/* Botón menú que abre/cierra Drawer */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          SmartVenta
        </Typography>

        {/* Usuario */}
        <IconButton
          size="large"
          color="inherit"
          onClick={handleProfileMenuOpen}
        >
          <AccountCircle />
        </IconButton>

        {/* Logout */}
        <IconButton
          size="large"
          color="inherit"
          onClick={handleLogout}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>

      {/* Menu perfil */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disabled>
          Negocio: {user?.tenant_name}
        </MenuItem>

        <MenuItem disabled>
          Usuario: {user?.full_name}
        </MenuItem>

        {user?.role === "owner" && user?.store_id && (
          <MenuItem onClick={handleBack}>
            Regresar
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
