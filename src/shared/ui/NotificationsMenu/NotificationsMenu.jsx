import React, { memo, useState, useEffect, useCallback } from "react";
import {
  IconButton, Badge, Popover, Box, Typography, List, ListItemButton,
  ListItemIcon, ListItemText,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InboxIcon from "@mui/icons-material/Inbox";
import { useWebSocket } from "@/src/context/WebSocketContext";

const isWithinAllowedHours = () => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 8 && hour < 21;
};

const EVENT_CONFIG = {
  transfer_created: { icon: <SwapHorizIcon fontSize="small" />, href: "/traspasos/" },
  transfer_confirmed: { icon: <CheckCircleIcon fontSize="small" color="success" />, href: "/traspasos/" },
  distribution_created: { icon: <LocalShippingIcon fontSize="small" />, href: "/distribuciones/" },
  distribution_confirmed: { icon: <CheckCircleIcon fontSize="small" color="success" />, href: "/distribuciones/" },
  stock_request_created: { icon: <SendIcon fontSize="small" />, href: "/solicitudes-ajustes-stock/" },
  stock_request_approved: { icon: <CheckCircleIcon fontSize="small" color="success" />, href: "/solicitudes-ajustes-stock/" },
  reservation_created: { icon: <ShoppingCartIcon fontSize="small" />, href: "/ventas/" },
};

const NotificationsMenu = memo(() => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [seen, setSeen] = useState(true);
  const { subscribeRaw } = useWebSocket();

  const handleMessage = useCallback((msg) => {
    // Solo procesamos mensajes de notificación conocidos (tienen `event`).
    if (!msg?.event) return;
    const config = EVENT_CONFIG[msg.event];
    // Ignorar eventos que no son notificaciones de este menú (p.ej. printer_status).
    if (!config && !msg.message) return;
    const resolved = config || { icon: <NotificationsIcon fontSize="small" />, href: "/" };
    setNotifications((prev) => [
      { id: `${msg.event}-${Date.now()}`, icon: resolved.icon, text: msg.message, storeName: msg.store_name, href: resolved.href },
      ...prev,
    ]);
    setSeen(false);
  }, []);

  useEffect(() => {
    if (!isWithinAllowedHours()) return;
    const unsubscribe = subscribeRaw(handleMessage);
    return unsubscribe;
  }, [subscribeRaw, handleMessage]);

  const count = notifications.length;

  return (
    <>
      <IconButton color="inherit" onClick={(e) => { setAnchorEl(e.currentTarget); setSeen(true); }}>
        <Badge badgeContent={seen ? 0 : count} color="error" max={99}>
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: 360, maxHeight: 420, borderRadius: 3, overflow: "hidden" } } }}
      >
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Notificaciones</Typography>
          {count > 0 && (
            <Typography variant="caption" sx={{ cursor: "pointer", color: "primary.main" }} onClick={() => setNotifications([])}>
              Limpiar
            </Typography>
          )}
        </Box>
        {count === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4, gap: 1, opacity: 0.6 }}>
            <InboxIcon sx={{ fontSize: 40 }} />
            <Typography variant="body2">Sin notificaciones</Typography>
          </Box>
        ) : (
          <List dense sx={{ maxHeight: 340, overflow: "auto", py: 0 }}>
            {notifications.map((n) => (
              <ListItemButton key={n.id} onClick={() => setAnchorEl(null)} sx={{ py: 1.2 }}>
                <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>{n.icon}</ListItemIcon>
                <ListItemText
                  primary={n.text}
                  secondary={n.storeName}
                  primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500 }}
                  secondaryTypographyProps={{ fontSize: "0.7rem" }}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
});

NotificationsMenu.displayName = "NotificationsMenu";

export default NotificationsMenu;
