import React from "react";
import { Box, Typography } from "@mui/material";

/** Tarjeta de encabezado de un tablero: título, descripción o periodo y, si hay, sus filtros. */
const DashboardHeader = ({ title, subtitle, filters, sx }) => (
  <Box className="card" sx={sx}>
    <Box sx={{ mb: filters ? 2 : 0 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>{title}</Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: filters ? 0 : 1 }}>{subtitle}</Typography>
      )}
    </Box>
    {filters}
  </Box>
);

export default DashboardHeader;
