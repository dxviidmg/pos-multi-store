import React, { memo } from "react";
import { Box, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

/**
 * Estado vacío centrado: ícono + mensaje (+ descripción opcional).
 *
 * Por defecto es el de los tableros (ícono 64, `minHeight` 350, título h6).
 * `compact` es la versión de los menús del header (ícono 40, texto body2).
 */
const EmptyState = ({ icon: Icon = InboxIcon, message, description, compact }) => {
  if (compact) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4, gap: 1, opacity: 0.6 }}>
        <Icon sx={{ fontSize: 40 }} />
        <Typography variant="body2">{message}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 350, gap: 2, opacity: 0.7 }}>
      <Icon sx={{ fontSize: 64, color: "text.secondary" }} />
      <Typography variant="h6" color="text.secondary">{message}</Typography>
      {description && <Typography variant="body2" color="text.secondary">{description}</Typography>}
    </Box>
  );
};

export default memo(EmptyState);
