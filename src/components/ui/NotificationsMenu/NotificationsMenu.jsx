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
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { getNotifications } from "../../../api/notifications";
import { canAccessRoute } from "../../../constants/routeAccess";
import { showWarning } from "../../../utils/alerts";
import { logger } from "../../../utils/logger";

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

const MULTISTORE_EVENTS = ["transfer_created", "transfer_confirmed", "distribution_created", "distribution_confirmed"];

const MAX_RECONNECT_ATTEMPTS = 5;
const POLLING_INTERVAL_MS = 60000;

// Mismo formato para mensajes del WebSocket y del respaldo HTTP.
const buildNotification = (msg) => {
  const config = EVENT_CONFIG[msg.event] || { icon: <NotificationsIcon fontSize="small" />, href: null };
  return { id: msg.id, icon: config.icon, text: msg.message, storeName: msg.store_name, href: config.href };
};

const NotificationsMenu = memo(() => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [seen, setSeen] = useState(true);
  const knownIdsRef = useRef(new Set());
  const sequenceRef = useRef(0);
  const navigate = useNavigate();
  const { user } = useUser();
  const token = user?.token;
  const storeId = user?.store_id;
  const multistore = !!user?.multistore;

  const addNotifications = useCallback((messages) => {
    const fresh = messages
      .filter((msg) => multistore || !MULTISTORE_EVENTS.includes(msg.event))
      .filter((msg) => !knownIdsRef.current.has(msg.id))
      .map(buildNotification);
    if (!fresh.length) return;
    fresh.forEach((n) => knownIdsRef.current.add(n.id));
    setNotifications((prev) => [...fresh, ...prev]);
    setSeen(false);
  }, [multistore]);

  // Se reconecta con token y tienda actuales cada vez que cambian (incluye cambio de tienda).
  useEffect(() => {
    if (!token || !WS_BASE || !isWithinAllowedHours()) return;

    let disposed = false;
    let ws = null;
    let attempts = 0;
    let reconnectTimer = null;
    let pollingTimer = null;

    const stopPolling = () => {
      clearInterval(pollingTimer);
      pollingTimer = null;
    };

    const poll = async () => {
      try {
        const { data } = await getNotifications();
        const items = Array.isArray(data) ? data : data?.results || [];
        if (disposed) return;
        addNotifications(items.map((msg) => ({
          ...msg,
          id: msg.id ? `api-${msg.id}` : `api-${msg.event}-${msg.created_at}-${msg.message}`,
        })));
      } catch (error) {
        logger.error("Error al obtener notificaciones:", error);
        if (error.response?.status === 404) stopPolling();
      }
    };

    const startPolling = () => {
      if (pollingTimer) return;
      poll();
      pollingTimer = setInterval(poll, POLLING_INTERVAL_MS);
    };

    const connect = () => {
      let url = `${WS_BASE}/ws/notifications/?token=${token}`;
      if (storeId) url += `&store_id=${storeId}`;

      ws = new WebSocket(url);

      ws.onopen = () => {
        attempts = 0;
        stopPolling();
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          sequenceRef.current += 1;
          addNotifications([{ ...msg, id: `ws-${sequenceRef.current}` }]);
        } catch (error) {
          logger.error("Notificación inválida:", error);
        }
      };

      // onclose siempre llega después de onerror: el intento fallido se cuenta solo ahí.
      ws.onclose = () => {
        if (disposed) return;
        if (attempts < MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(1000 * 2 ** attempts, 30000);
          attempts += 1;
          reconnectTimer = setTimeout(connect, delay);
        } else {
          startPolling();
        }
      };
    };

    connect();

    return () => {
      disposed = true;
      clearTimeout(reconnectTimer);
      stopPolling();
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, [token, storeId, addNotifications]);

  const handleOpenNotification = (notification) => {
    setAnchorEl(null);
    if (!notification.href) return;
    if (!canAccessRoute(user, notification.href)) {
      showWarning(
        "No se pudo abrir la notificación",
        notification.storeName ? `Entra a ${notification.storeName} para ver el detalle.` : "No tienes acceso a esa sección desde esta vista."
      );
      return;
    }
    navigate(notification.href);
  };

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
              <ListItemButton key={n.id} onClick={() => handleOpenNotification(n)} sx={{ py: 1.2 }}>
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
