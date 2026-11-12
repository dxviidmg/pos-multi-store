import React, { memo, useMemo } from "react";
import TuneIcon from "@mui/icons-material/Tune";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { getStockUpdateRequests } from "../../../api/stockRequests";
import { useStoreScopedList } from "../../../hooks/useStoreScopedList";
import HeaderPopoverMenu from "../HeaderPopoverMenu/HeaderPopoverMenu";
import HeaderMenuItem from "../HeaderPopoverMenu/HeaderMenuItem";

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
        <HeaderMenuItem key={i} primary={store} secondary={`${count} solicitud(es)`} />
      ))}
    </HeaderPopoverMenu>
  );
};

export default memo(StockRequestMenu);
