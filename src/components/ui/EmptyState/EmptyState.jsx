import React, { memo } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

/**
 * Estado vacío centrado: ícono en un círculo suave + mensaje (+ descripción opcional).
 *
 * Por defecto es el de los tableros y listas (minHeight 320).
 * `compact` es la versión de los menús del header.
 */
const EmptyState = ({ icon: Icon = InboxOutlinedIcon, message, description, compact }) => {
  if (compact) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4, px: 2, gap: 1, textAlign: "center" }}>
        <Box sx={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "action.hover", color: "text.secondary" }}>
          <Icon sx={{ fontSize: 24 }} />
        </Box>
        <Typography variant="body2" color="text.secondary">{message}</Typography>
      </Box>
    );
  }

  return (
    <Box
      className="fade-in-up"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: { xs: 240, md: 320 }, gap: 1, px: 2, textAlign: "center" }}
    >
      <Box
        sx={{
          width: 72, height: 72, mb: 1, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "primary.main",
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.14 : 0.07),
          boxShadow: (theme) => `0 0 0 8px ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.06 : 0.03)}`,
          animation: "empty-float 3.2s ease-in-out infinite",
          "@keyframes empty-float": { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-4px)" } },
        }}
      >
        <Icon sx={{ fontSize: 34 }} />
      </Box>
      <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>{message}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>{description}</Typography>
      )}
    </Box>
  );
};

export default memo(EmptyState);
