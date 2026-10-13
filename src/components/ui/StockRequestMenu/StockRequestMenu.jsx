import React, { memo, useMemo } from "react";
import { ListItem, ListItemText } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { getStockUpdateRequests } from "../../../api/stockRequests";
import { useStoreScopedList } from "../../../hooks/useStoreScopedList";
import HeaderPopoverMenu from "../HeaderPopoverMenu/HeaderPopoverMenu";

const StockRequestMenu = () => {
  const { items, refresh } = useStoreScopedList(getStockUpdateRequests, "Error al obtener solicitudes de ajuste:");

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
      onOpen={refresh}
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
};

export default memo(StockRequestMenu);
