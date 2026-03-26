import React, { memo, useState, useEffect, useCallback } from "react";
import {
  IconButton, Badge, Popover, Box, Typography, List, ListItem,
  ListItemText,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InboxIcon from "@mui/icons-material/Inbox";
import { getPendingMovements } from "../../../api/notifications";

const PendingMenu = memo(() => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [items, setItems] = useState([]);
  const [seen, setSeen] = useState(false);

  const fetchPending = useCallback(async () => {
    try {
      const { data } = await getPendingMovements();
      setItems(data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchPending();
    const onStoreChange = () => fetchPending();
    window.addEventListener("store-changed", onStoreChange);
    return () => window.removeEventListener("store-changed", onStoreChange);
  }, [fetchPending]);

  const count = items.reduce((sum, g) => sum + g.messages.length, 0);

  return (
    <>
      <IconButton color="inherit" onClick={(e) => { setAnchorEl(e.currentTarget); setSeen(true); fetchPending(); }}>
        <Badge badgeContent={seen ? 0 : count} color="warning" max={99}>
          <AssignmentIcon />
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
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Movimientos pendientes</Typography>
        </Box>
        {items.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4, gap: 1, opacity: 0.6 }}>
            <InboxIcon sx={{ fontSize: 40 }} />
            <Typography variant="body2">Sin pendientes</Typography>
          </Box>
        ) : (
          <List dense sx={{ maxHeight: 340, overflow: "auto", py: 0 }}>
            {items.map((group, i) => (
              <ListItem key={i} sx={{ flexDirection: "column", alignItems: "flex-start", py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <ListItemText
                  primary={group.title}
                  primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 700 }}
                />
                {group.messages.map((msg, j) => (
                  <Typography key={j} variant="body2" sx={{ fontSize: "0.75rem", color: "text.secondary", pl: 1 }}>
                    • {msg}
                  </Typography>
                ))}
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
});

PendingMenu.displayName = "PendingMenu";

export default PendingMenu;
