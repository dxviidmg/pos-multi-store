import React from "react";
import { Box, Grid, Typography } from "@mui/material";

const STAT_ITEM_PROPS = { xs: 12, sm: 6, md: 3 };

/** Indicador con ícono a la izquierda (tableros de verificación de stock y traspasos). */
const StatCard = ({ icon: Icon, iconColor, label, value, itemProps = STAT_ITEM_PROPS }) => (
  <Grid item {...itemProps}>
    <Box className="card" sx={{ height: "100%", mb: 0, display: "flex", alignItems: "center", gap: 2 }}>
      <Icon sx={{ fontSize: 32, color: iconColor }} />
      <Box>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
      </Box>
    </Box>
  </Grid>
);

export default StatCard;
