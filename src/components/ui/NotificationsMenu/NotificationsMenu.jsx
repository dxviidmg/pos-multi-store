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
import { getUserData } from "../../../api/utils";
import { getOwnerNotifications } from "../../../api/notifications";

const WS_BASE = process.env.REACT_APP_API_URL?.replace(/^http/, "ws");

const EVENT_CONFIG = {
  transfer_created: { icon: <SwapHorizIcon fontSize="small" />, href: "/traspasos/" },
  transfer_confirmed: { icon: <CheckCircleIcon fontSize="small" color="success" />, href: "/traspasos/" },
  distribution_created: { icon: <LocalShippingIcon fontSize="small" />, href: "/distribuciones/" },
  distribution_confirmed: { icon: <CheckCircleIcon fontSize="small" color="success" />, href: "/distribuciones/" },
  stock_request_created: { icon: <SendIcon fontSize="small" />, href: "/solicitudes-ajustes/" },
  stock_request_approved: { icon: <CheckCircleIcon fontSize="small" color="success" />, href: "/solicitudes-ajustes/" },
  reservation_created: { icon: <ShoppingCartIcon fontSize="small" />, href: "/ventas/" },
};

const NotificationsMenu = memo(() => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [seen, setSeen] = useState(false);
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);
  const navigate = useNavigate();

  const fetchPending = useCallback(async () => {
    try {
      const { data } = await getOwnerNotifications();
      const items = [];
      data.forEach((s) => {
        if (s.pending_transfers)
          items.push({ id: `t-${s.store}`, icon: EVENT_CONFIG.transfer_created.icon, text: `${s.pending_transfers} traspaso(s) pendiente(s)`, storeName: s.store_name, storeId: s.store, href: "/traspasos/" });
        if (s.pending_distributions)
          items.push({ id: `d-${s.store}`, icon: EVENT_CONFIG.distribution_created.icon, text: `${s.pending_distributions} distribución(es) pendiente(s)`, storeName: s.store_name, storeId: s.store, href: "/distribuciones/" });
      });
      setNotifications(items);
      if (items.length > 0) setSeen(false);
    } catch {}
  }, []);

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
        { id: `${msg.event}-${Date.now()}`, icon: config.icon, text: msg.message, storeName: msg.store_name, storeId: msg.store_id, href: config.href },
        ...prev,
      ]);
      setSeen(false);
    };

    ws.onclose = () => {
      reconnectRef.current = setTimeout(connectWs, 5000);
    };
  }, []);

  useEffect(() => {
    fetchPending();
    connectWs();

    const onStoreChange = () => { fetchPending(); connectWs(); };
    window.addEventListener("store-changed", onStoreChange);

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      window.removeEventListener("store-changed", onStoreChange);
    };
  }, [connectWs]);

  const handleClick = (n) => {
    setAnchorEl(null);
    if (n.storeId) {
      const user = getUserData();
      const updated = { ...user, store_id: n.storeId, store_name: n.storeName };
      localStorage.setItem("user", JSON.stringify(updated));
      window.dispatchEvent(new Event("store-changed"));
    }
    navigate(n.href);
  };

  const handleClear = () => setNotifications([]);

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
            <Typography variant="caption" sx={{ cursor: "pointer", color: "primary.main" }} onClick={handleClear}>
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
              <ListItemButton key={n.id} onClick={() => handleClick(n)} sx={{ py: 1.2 }}>
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
