import { memo, useState, useEffect } from "react";
import {
  IconButton, Badge, Popover, Box, Typography, List, ListItemButton,
  ListItemIcon, ListItemText,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CancelIcon from "@mui/icons-material/Cancel";
import InboxIcon from "@mui/icons-material/Inbox";
import { useNavigate } from "react-router-dom";
import { getOwnerNotifications } from "../../../api/notifications";

const NotificationsMenu = memo(() => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const { data } = await getOwnerNotifications();
      const items = [];
      data.forEach((s) => {
        if (s.pending_transfers)
          items.push({ id: `t-${s.store}`, icon: <SwapHorizIcon fontSize="small" />, text: `${s.pending_transfers} traspaso(s) pendiente(s)`, store: s.store, href: "/traspasos/" });
        if (s.pending_distributions)
          items.push({ id: `d-${s.store}`, icon: <LocalShippingIcon fontSize="small" />, text: `${s.pending_distributions} distribución(es) pendiente(s)`, store: s.store, href: "/distribuciones/" });
        if (s.duplicate_sales?.length)
          items.push({ id: `dup-${s.store}`, icon: <WarningAmberIcon fontSize="small" />, text: `${s.duplicate_sales.length} venta(s) duplicada(s): #${s.duplicate_sales.join(", #")}`, store: s.store, href: "/ventas/" });
        if (s.canceled_sales?.length)
          items.push({ id: `can-${s.store}`, icon: <CancelIcon fontSize="small" />, text: `${s.canceled_sales.length} venta(s) cancelada(s): #${s.canceled_sales.join(", #")}`, store: s.store, href: "/ventas/" });
      });
      setNotifications(items);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (href) => {
    setAnchorEl(null);
    navigate(href);
  };

  const count = notifications.length;

  return (
    <>
      <IconButton color="inherit" onClick={(e) => { setAnchorEl(e.currentTarget); fetchNotifications(); }}>
        <Badge badgeContent={count} color="error" max={99}>
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
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Notificaciones</Typography>
        </Box>
        {count === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4, gap: 1, opacity: 0.6 }}>
            <InboxIcon sx={{ fontSize: 40 }} />
            <Typography variant="body2">Sin notificaciones</Typography>
          </Box>
        ) : (
          <List dense sx={{ maxHeight: 340, overflow: "auto", py: 0 }}>
            {notifications.map((n) => (
              <ListItemButton key={n.id} onClick={() => handleClick(n.href)} sx={{ py: 1.2 }}>
                <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>{n.icon}</ListItemIcon>
                <ListItemText
                  primary={n.text}
                  secondary={n.store}
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
