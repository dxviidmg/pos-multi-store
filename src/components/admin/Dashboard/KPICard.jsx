import React from "react";
import { Box, Grid, Typography } from "@mui/material";

const KPI_ITEM_PROPS = { xs: 6, md: 3 };

// La tarjeta destacada ancla la fila: borde de acento a la izquierda y valor más grande.
const FEATURED_CARD_SX = { borderLeft: "3px solid", borderLeftColor: "primary.main" };

/** Tarjeta de indicador de los tableros dentro de su `Grid item`. Con `featured`, el indicador principal pesa más. */
const KPICard = ({ title, value, subtitle, featured = false, itemProps = KPI_ITEM_PROPS }) => (
  <Grid item {...itemProps}>
    <Box className="card" sx={{ height: "100%", mb: 0, ...(featured ? FEATURED_CARD_SX : {}) }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
        {title}
      </Typography>
      <Typography variant={featured ? "h3" : "h4"} sx={{ fontWeight: featured ? 700 : 600, mb: 0.5, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
      )}
    </Box>
  </Grid>
);

export default KPICard;
