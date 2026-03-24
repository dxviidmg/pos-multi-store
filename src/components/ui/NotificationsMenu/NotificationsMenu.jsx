import { memo, useState, useEffect } from "react";
import {
  IconButton, Badge, Popover, Box, Typography, List, ListItemButton,
  ListItemIcon, ListItemText,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InboxIcon from "@mui/icons-material/Inbox";
import { useNavigate } from "react-router-dom";
import { getTransfers, getDistributions } from "../../../api/transfers";
import { getSales } from "../../../api/sales";
import { calculateTimeAgo, getFormattedDate } from "../../../utils/utils";

const NotificationsMenu = memo(({ storeType }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const items = [];
      const { data: transfers } = await getTransfers();
      if (transfers?.length) {
        transfers.forEach((t) =>
          items.push({
            id: `t-${t.id}`,
            icon: <SwapHorizIcon fontSize="small" />,
            text: `Traspaso: ${t.product_description} (x${t.quantity})`,
            time: t.created_at,
            href: "/traspasos/",
          })
        );
      }
      if (storeType === "T") {
        const { data: distributions } = await getDistributions();
        if (distributions?.length) {
          distributions.filter((d) => !d.confirmed).forEach((d) =>
            items.push({
              id: `d-${d.id}`,
              icon: <LocalShippingIcon fontSize="small" />,
              text: `Distribución pendiente: ${d.product_description || "Productos"} (x${d.quantity})`,
              time: d.created_at,
              href: "/distribuciones/",
            })
          );
        }
      }
      const { data: sales } = await getSales({ date: getFormattedDate() });
      const duplicated = sales?.filter((s) => s.is_repeated) || [];
      if (duplicated.length) {
        items.push({
          id: "dup-sales",
          icon: <WarningAmberIcon fontSize="small" />,
          text: `${duplicated.length} venta(s) duplicada(s) hoy`,
          time: duplicated[0].created_at,
          href: "/ventas/",
        });
      }
      items.sort((a, b) => new Date(b.time) - new Date(a.time));
      setNotifications(items);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [storeType]);

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
                  secondary={n.time ? calculateTimeAgo(n.time) : ""}
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
