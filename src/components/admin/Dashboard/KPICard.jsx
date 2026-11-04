import React from "react";
import { Box, Grid, Typography } from "@mui/material";

const KPI_ITEM_PROPS = { xs: 6, md: 3 };

/** Tarjeta de indicador de los tableros dentro de su `Grid item`. */
const KPICard = ({ title, value, subtitle, itemProps = KPI_ITEM_PROPS }) => (
  <Grid item {...itemProps}>
    <Box className="card" sx={{ height: "100%", mb: 0 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
      )}
    </Box>
  </Grid>
);

export default KPICard;
