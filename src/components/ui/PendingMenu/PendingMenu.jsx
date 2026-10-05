import React, { memo, useState, useEffect, useCallback } from "react";
import { Typography, ListItem, ListItemText } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InboxIcon from "@mui/icons-material/Inbox";
import { getPendingMovements } from "../../../api/notifications";
import { logger } from "../../../utils/logger";
import HeaderPopoverMenu from "../HeaderPopoverMenu/HeaderPopoverMenu";

const PendingMenu = memo(() => {
  const [items, setItems] = useState([]);

  const fetchPending = useCallback(async () => {
    try {
      const { data } = await getPendingMovements();
      setItems(data);
    } catch (error) {
      logger.error("Error al obtener movimientos pendientes:", error);
    }
  }, []);

  useEffect(() => {
    fetchPending();
    const onStoreChange = () => fetchPending();
    window.addEventListener("store-changed", onStoreChange);
    return () => window.removeEventListener("store-changed", onStoreChange);
  }, [fetchPending]);

  const count = items.reduce((sum, g) => sum + (g.messages?.length || 0), 0);

  return (
    <HeaderPopoverMenu
      icon={<AssignmentIcon />}
      tooltip="Movimientos pendientes"
      title="Movimientos pendientes"
      badgeCount={count}
      onOpen={fetchPending}
      isEmpty={items.length === 0}
      emptyIcon={InboxIcon}
      emptyText="Sin pendientes"
    >
      {items.map((group, i) => (
        <ListItem key={i} sx={{ flexDirection: "column", alignItems: "flex-start", py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <ListItemText
            primary={group.title}
            primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 700 }}
          />
          {(group.messages || []).map((msg, j) => (
            <Typography key={j} variant="body2" sx={{ fontSize: "0.75rem", color: "text.secondary", pl: 1 }}>
              • {msg}
            </Typography>
          ))}
        </ListItem>
      ))}
    </HeaderPopoverMenu>
  );
});

PendingMenu.displayName = "PendingMenu";

export default PendingMenu;
