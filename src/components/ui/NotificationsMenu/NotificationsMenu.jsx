import React, { memo, useState, useEffect, useRef, useCallback } from "react";
import { Button, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InboxIcon from "@mui/icons-material/Inbox";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { getApiWsUrl } from "../../../api/utils";
import { canAccessRoute } from "../../../constants/routeAccess";
import { showWarning } from "../../../utils/alerts";
import { logger } from "../../../utils/logger";
import HeaderPopoverMenu from "../HeaderPopoverMenu/HeaderPopoverMenu";

const WS_URL = getApiWsUrl("ws/notifications/");

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

// Mismo formato para mensajes del WebSocket y del respaldo HTTP.
const buildNotification = (msg) => {
  const config = EVENT_CONFIG[msg.event] || { icon: <NotificationsIcon fontSize="small" />, href: null };
  return { id: msg.id, icon: config.icon, text: msg.message, storeName: msg.store_name, href: config.href };
};

const NotificationsMenu = memo(() => {
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
    if (!token || !WS_URL || !isWithinAllowedHours()) return;

    let disposed = false;
    let ws = null;
    let attempts = 0;
    let reconnectTimer = null;

    const connect = () => {
      let url = `${WS_URL}?token=${token}`;
      if (storeId) url += `&store_id=${storeId}`;

      ws = new WebSocket(url);

      ws.onopen = () => {
        attempts = 0;
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
        }
      };
    };

    connect();

    return () => {
      disposed = true;
      clearTimeout(reconnectTimer);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, [token, storeId, addNotifications]);

  const handleOpenNotification = (notification, close) => {
    close();
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
    <HeaderPopoverMenu
      icon={<NotificationsIcon />}
      tooltip="Notificaciones"
      title="Notificaciones"
      badgeCount={seen ? 0 : count}
      autoHideBadge={false}
      onOpen={() => setSeen(true)}
      headerAction={count > 0 && (
        <Button size="small" onClick={() => setNotifications([])}>
          Limpiar
        </Button>
      )}
      isEmpty={count === 0}
      emptyIcon={InboxIcon}
      emptyText="Sin notificaciones"
    >
      {(close) => notifications.map((n) => (
        <ListItemButton key={n.id} onClick={() => handleOpenNotification(n, close)} sx={{ py: 1.2 }}>
          <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>{n.icon}</ListItemIcon>
          <ListItemText
            primary={n.text}
            secondary={n.storeName}
            primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500 }}
            secondaryTypographyProps={{ fontSize: "0.7rem" }}
          />
        </ListItemButton>
      ))}
    </HeaderPopoverMenu>
  );
});

NotificationsMenu.displayName = "NotificationsMenu";

export default NotificationsMenu;
