import React, { useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Backdrop,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useUser } from "../../../context/UserContext";
import { getStores } from "../../../api/stores";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { cleanCart } from "../../../redux/cart/cartActions";
import CustomTooltip from "../../ui/Tooltip";

const StoreSelector = ({ currentStoreName, onBackToGeneral, isMultistore, drawerOpen = true }) => {
  const { user, updateUser } = useUser();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpanded = async () => {
    if (!expanded && stores.length === 0) {
      setLoading(true);
      try {
        const response = await getStores();
        setStores(response.data || []);
      } catch (error) {
        console.error("Error al obtener tiendas:", error);
        setStores([]);
      } finally {
        setLoading(false);
      }
    }
    setExpanded(!expanded);
  };

  const handleSelectStore = async (storeId) => {
    if (storeId !== user.store_id) {
      const selectedStore = stores.find(s => s.id === storeId);
      if (selectedStore) {
        setSwitching(true);
        setExpanded(false);

        await new Promise(resolve => setTimeout(resolve, 1000));

        queryClient.clear();
        dispatch(cleanCart());
        updateUser({
          store_id: storeId,
          store_name: selectedStore.full_name || selectedStore.name,
          store_type: "T"
        });
        window.dispatchEvent(new Event("store-changed"));

        setSwitching(false);
      }
    } else {
      setExpanded(false);
    }
  };

  // Cuando el drawer está cerrado, mostrar solo el icono
  if (!drawerOpen) {
    const handleOpenIconMenu = async (e) => {
      if (stores.length === 0) {
        setLoading(true);
        try {
          const response = await getStores();
          setStores(response.data || []);
        } catch (error) {
          console.error("Error al obtener tiendas:", error);
          setStores([]);
        } finally {
          setLoading(false);
        }
      }
      setAnchorEl(e.currentTarget);
    };
    const handleCloseIconMenu = () => setAnchorEl(null);

    return (
      <>
        <Box sx={{ px: 1.5, py: 1, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "center" }}>
          <CustomTooltip text={currentStoreName || "Cambiar tienda"}>
            <Button
              onClick={handleOpenIconMenu}
              sx={{
                minWidth: "40px",
                padding: "8px",
                color: "rgba(255,255,255,0.7)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.9)" },
              }}
            >
              <StoreIcon fontSize="small" />
            </Button>
          </CustomTooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseIconMenu}
          PaperProps={{
            sx: {
              backgroundColor: "rgba(30, 40, 60, 0.95)",
              backdropFilter: "blur(10px)",
              color: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={20} />
            </Box>
          ) : (
            <>
              {stores.map((store) => (
                <MenuItem
                  key={store.id}
                  onClick={() => handleSelectStore(store.id)}
                  selected={store.id === user.store_id}
                  sx={{
                    fontSize: "0.8rem",
                    color: store.id === user.store_id ? "rgba(255, 193, 7, 1)" : "rgba(255,255,255,0.8)",
                    backgroundColor: store.id === user.store_id ? "rgba(255, 193, 7, 0.1)" : "transparent",
                    "&:hover": {
                      backgroundColor: store.id === user.store_id ? "rgba(255, 193, 7, 0.15)" : "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  {store.full_name || store.name}
                </MenuItem>
              ))}
              <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
              <MenuItem
                onClick={onBackToGeneral}
                sx={{
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.7)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: "1rem", mr: 1 }} />
                Ver General
              </MenuItem>
            </>
          )}
        </Menu>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={switching}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </>
    );
  }

  // Para single-store, solo mostrar botón "Ver General"
  if (!isMultistore) {
    return (
      <ListItem disablePadding sx={{ mb: 0 }}>
        <ListItemButton
          onClick={onBackToGeneral}
          sx={{
            borderRadius: "10px", py: 1,
            justifyContent: "initial",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
          }}
        >
          <ListItemIcon sx={{ color: "rgba(255,255,255,0.7)", minWidth: 38, justifyContent: "center" }}>
            <ArrowBackIcon />
          </ListItemIcon>
          <ListItemText
            primary="Ver General"
            primaryTypographyProps={{ fontWeight: 600, fontSize: "0.8rem" }}
          />
        </ListItemButton>
      </ListItem>
    );
  }

  // Para multi-store, mostrar selector en formato dropdown exacto a los otros menús
  return (
    <>
      <ListItem disablePadding sx={{ mb: 0.3 }}>
        <ListItemButton
          onClick={handleToggleExpanded}
          sx={{
            borderRadius: "10px", py: 1,
            justifyContent: drawerOpen ? "initial" : "center",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
          }}
        >
          <ListItemIcon sx={{ color: "rgba(255,255,255,0.7)", minWidth: drawerOpen ? 38 : 0, justifyContent: "center" }}>
            <StoreIcon />
          </ListItemIcon>
          <ListItemText
            primary="Tienda"
            secondary={drawerOpen ? currentStoreName : null}
            primaryTypographyProps={{ fontWeight: 600, fontSize: "0.8rem" }}
            secondaryTypographyProps={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}
            sx={{ opacity: drawerOpen ? 1 : 0 }}
          />
          {drawerOpen && (expanded ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />)}
        </ListItemButton>
      </ListItem>
      {drawerOpen && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 1.5, pl: 6.5 }}>
                <CircularProgress size={18} />
              </Box>
            ) : (
              <>
                {stores.map((store) => (
                  <ListItemButton
                    key={store.id}
                    onClick={() => handleSelectStore(store.id)}
                    sx={{
                      pl: 6.5, py: 0.6, borderRadius: "8px", my: 0.2, mx: 0.5,
                      backgroundColor: store.id === user.store_id ? "rgba(255, 193, 7, 0.1)" : "transparent",
                      "&:hover": { backgroundColor: store.id === user.store_id ? "rgba(255, 193, 7, 0.15)" : "rgba(255,255,255,0.06)" },
                    }}
                  >
                    <ListItemText
                      primary={store.full_name || store.name}
                      primaryTypographyProps={{
                        fontSize: "0.75rem",
                        color: store.id === user.store_id ? "rgba(255, 193, 7, 1)" : "rgba(255,255,255,0.75)",
                        fontWeight: store.id === user.store_id ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                ))}
                <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 0.2 }} />
                <ListItemButton
                  onClick={onBackToGeneral}
                  sx={{
                    pl: 6.5, py: 0.6, borderRadius: "8px", my: 0.2, mx: 0.5,
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
                  }}
                >
                  <ListItemText
                    primary="Ver General"
                    primaryTypographyProps={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.75)",
                    }}
                  />
                </ListItemButton>
              </>
            )}
          </List>
        </Collapse>
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={switching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default StoreSelector;
