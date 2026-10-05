import React, { memo, useState, useEffect, useCallback } from "react";
import { Typography, ListItem, ListItemText } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { getDuplicateSales } from "../../../api/notifications";
import { logger } from "../../../utils/logger";
import HeaderPopoverMenu from "../HeaderPopoverMenu/HeaderPopoverMenu";

const DuplicateSalesMenu = memo(() => {
  const [items, setItems] = useState([]);

  const fetchDuplicates = useCallback(async () => {
    try {
      const { data } = await getDuplicateSales();
      setItems(data);
    } catch (error) {
      logger.error("Error al obtener ventas duplicadas:", error);
    }
  }, []);

  useEffect(() => {
    fetchDuplicates();
    const onStoreChange = () => fetchDuplicates();
    window.addEventListener("store-changed", onStoreChange);
    return () => window.removeEventListener("store-changed", onStoreChange);
  }, [fetchDuplicates]);

  const count = items.reduce((sum, g) => sum + (g.messages?.length || 0), 0);

  return (
    <HeaderPopoverMenu
      icon={<ContentCopyIcon />}
      tooltip="Ventas duplicadas"
      title="Ventas duplicadas"
      badgeCount={count}
      onOpen={fetchDuplicates}
      isEmpty={items.length === 0}
      emptyIcon={CheckCircleOutlineIcon}
      emptyText="Sin duplicadas hoy"
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
});

DuplicateSalesMenu.displayName = "DuplicateSalesMenu";

export default DuplicateSalesMenu;
