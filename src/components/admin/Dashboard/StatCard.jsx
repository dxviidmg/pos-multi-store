import React from "react";
import { Box, Grid, Typography } from "@mui/material";

const STAT_ITEM_PROPS = { xs: 12, sm: 6, md: 3 };

// La tarjeta destacada ancla la fila: borde de acento a la izquierda y valor más grande.
const FEATURED_CARD_SX = { borderLeft: "3px solid", borderLeftColor: "primary.main" };

/** Indicador con ícono a la izquierda (tableros de verificación de stock y traspasos). Con `featured`, el indicador principal pesa más. */
const StatCard = ({ icon: Icon, iconColor, label, value, featured = false, itemProps = STAT_ITEM_PROPS }) => (
  <Grid item {...itemProps}>
    <Box className="card" sx={{ height: "100%", mb: 0, display: "flex", alignItems: "center", gap: 2, ...(featured ? FEATURED_CARD_SX : {}) }}>
      <Icon sx={{ fontSize: featured ? 40 : 32, color: iconColor }} />
      <Box>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant={featured ? "h4" : "h5"} sx={{ fontWeight: 700 }}>{value}</Typography>
      </Box>
    </Box>
  </Grid>
);

export default StatCard;
