import React, { memo, useState, useEffect, useCallback, useMemo } from "react";
import {
  IconButton, Badge, Popover, Box, Typography, List, ListItem,
  ListItemText,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { getStockUpdateRequests } from "../../../api/notifications";

const StockRequestMenu = memo(() => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [items, setItems] = useState([]);
  const [seen, setSeen] = useState(false);

  const fetchPending = useCallback(async () => {
    try {
      const { data } = await getStockUpdateRequests();
      setItems(data);
    } catch {}
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
    <>
      <IconButton color="inherit" onClick={(e) => { setAnchorEl(e.currentTarget); setSeen(true); fetchPending(); }}>
        <Badge badgeContent={seen ? 0 : items.length} color="error" max={99}>
          <TuneIcon />
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
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Solicitudes de ajuste</Typography>
        </Box>
        {items.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4, gap: 1, opacity: 0.6 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 40 }} />
            <Typography variant="body2">Sin solicitudes pendientes</Typography>
          </Box>
        ) : (
          <List dense sx={{ maxHeight: 340, overflow: "auto", py: 0 }}>
            {grouped.map(([store, count], i) => (
              <ListItem key={i} sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <ListItemText
                  primary={store}
                  secondary={`${count} solicitud(es)`}
                  primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 700 }}
                  secondaryTypographyProps={{ fontSize: "0.75rem" }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
});

StockRequestMenu.displayName = "StockRequestMenu";

export default StockRequestMenu;
