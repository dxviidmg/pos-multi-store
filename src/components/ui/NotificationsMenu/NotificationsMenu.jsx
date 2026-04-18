import React, { memo, useState, useEffect, useRef, useCallback } from "react";
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
import { getUserData } from "../../../api/utils";

const WS_BASE = process.env.REACT_APP_API_URL?.replace(/^http/, "ws");

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

let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
let pollingInterval = null;

const NotificationsMenu = memo(() => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [seen, setSeen] = useState(true);
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);

  const connectWs = useCallback(() => {
    const user = getUserData();
    if (!user?.token || !WS_BASE) return;

    if (wsRef.current) wsRef.current.close();
    if (reconnectRef.current) clearTimeout(reconnectRef.current);

    let url = `${WS_BASE}/ws/notifications/?token=${user.token}`;
    if (user.store_id) url += `&store_id=${user.store_id}`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const config = EVENT_CONFIG[msg.event] || { icon: <NotificationsIcon fontSize="small" />, href: "/" };
      setNotifications((prev) => [
        { id: `${msg.event}-${Date.now()}`, icon: config.icon, text: msg.message, storeName: msg.store_name, href: config.href },
        ...prev,
      ]);
      setSeen(false);
    };

    ws.onerror = () => {
      reconnectAttempts++;
      ws.close();
    };

    ws.onclose = () => {
      if (reconnectAttempts < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        reconnectAttempts++;
        reconnectRef.current = setTimeout(connectWs, delay);
      } else {
        // Fallback a polling cada 60s
        if (!pollingInterval) {
          pollingInterval = setInterval(() => {
            fetch('/api/audit/notifications/')
              .then(r => r.json())
              .then(data => setNotifications(data));
          }, 60000);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!isWithinAllowedHours()) return;

    connectWs();
    const onStoreChange = () => connectWs();
    window.addEventListener("store-changed", onStoreChange);
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (pollingInterval) clearInterval(pollingInterval);
      window.removeEventListener("store-changed", onStoreChange);
    };
  }, [connectWs]);

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
