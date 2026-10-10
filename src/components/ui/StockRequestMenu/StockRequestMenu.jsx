import React, { memo, useState, useEffect, useCallback, useMemo } from "react";
import { ListItem, ListItemText } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { getStockUpdateRequests } from "../../../api/stockRequests";
import { logger } from "../../../utils/logger";
import HeaderPopoverMenu from "../HeaderPopoverMenu/HeaderPopoverMenu";

const StockRequestMenu = memo(() => {
  const [items, setItems] = useState([]);

  const fetchPending = useCallback(async () => {
    try {
      const { data } = await getStockUpdateRequests();
      setItems(data);
    } catch (error) {
      logger.error("Error al obtener solicitudes de ajuste:", error);
    }
  }, []);

  useEffect(() => {
    fetchPending();
    const onStoreChange = () => fetchPending();
    window.addEventListener("store-changed", onStoreChange);
    return () => window.removeEventListener("store-changed", onStoreChange);
  }, [fetchPending]);

  const grouped = useMemo(() => {
    const map = {};
    items.forEach((req) => {
      map[req.store_name] = (map[req.store_name] || 0) + 1;
    });
    return Object.entries(map);
  }, [items]);

  return (
    <HeaderPopoverMenu
      icon={<TuneIcon />}
      tooltip="Solicitudes de ajuste"
      title="Solicitudes de ajuste"
      badgeCount={items.length}
      onOpen={fetchPending}
      isEmpty={items.length === 0}
      emptyIcon={CheckCircleOutlineIcon}
      emptyText="Sin solicitudes pendientes"
    >
      {grouped.map(([store, count], i) => (
        <ListItem key={i} sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
          <ListItemText
            primary={store}
            secondary={`${count} solicitud(es)`}
            primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 700 }}
            secondaryTypographyProps={{ fontSize: "0.75rem" }}
          />
        </ListItem>
      ))}
    </HeaderPopoverMenu>
  );
});

StockRequestMenu.displayName = "StockRequestMenu";

export default StockRequestMenu;
