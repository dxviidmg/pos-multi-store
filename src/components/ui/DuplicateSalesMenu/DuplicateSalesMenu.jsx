import React, { memo, useState, useEffect, useCallback } from "react";
import {
  IconButton, Badge, Popover, Box, Typography, List, ListItem,
  ListItemText,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { getDuplicateSales } from "../../../api/notifications";

const DuplicateSalesMenu = memo(() => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [items, setItems] = useState([]);
  const [seen, setSeen] = useState(false);

  const fetchDuplicates = useCallback(async () => {
    try {
      const { data } = await getDuplicateSales();
      setItems(data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchDuplicates();
    const onStoreChange = () => fetchDuplicates();
    window.addEventListener("store-changed", onStoreChange);
    return () => window.removeEventListener("store-changed", onStoreChange);
  }, [fetchDuplicates]);

  const count = items.reduce((sum, g) => sum + (g.messages?.length || 0), 0);

  return (
    <>
      <IconButton color="inherit" onClick={(e) => { setAnchorEl(e.currentTarget); setSeen(true); fetchDuplicates(); }}>
        <Badge badgeContent={seen ? 0 : count} color="error" max={99}>
          <ContentCopyIcon />
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
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Ventas duplicadas</Typography>
        </Box>
        {items.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4, gap: 1, opacity: 0.6 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 40 }} />
            <Typography variant="body2">Sin duplicadas hoy</Typography>
          </Box>
        ) : (
          <List dense sx={{ maxHeight: 340, overflow: "auto", py: 0 }}>
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
          </List>
        )}
      </Popover>
    </>
  );
});

DuplicateSalesMenu.displayName = "DuplicateSalesMenu";

export default DuplicateSalesMenu;
