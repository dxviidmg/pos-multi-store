import React, { memo } from "react";
import { Typography, ListItem, ListItemText } from "@mui/material";
import { useStoreScopedList } from "../../../hooks/useStoreScopedList";
import HeaderPopoverMenu from "../HeaderPopoverMenu/HeaderPopoverMenu";

/**
 * Menú del header con grupos `{ title, messages[] }` que entrega el backend
 * (movimientos pendientes, ventas duplicadas). El contador suma los mensajes.
 */
const MessageGroupsMenu = ({ icon, title, fetchFn, errorMessage, emptyIcon, emptyText }) => {
  const { items, refresh } = useStoreScopedList(fetchFn, errorMessage);
  const count = items.reduce((sum, group) => sum + (group.messages?.length || 0), 0);

  return (
    <HeaderPopoverMenu
      icon={icon}
      tooltip={title}
      title={title}
      badgeCount={count}
      onOpen={refresh}
      isEmpty={items.length === 0}
      emptyIcon={emptyIcon}
      emptyText={emptyText}
    >
      {items.map((group, i) => (
        <ListItem key={i} sx={{ flexDirection: "column", alignItems: "flex-start", py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
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
};

export default memo(MessageGroupsMenu);
