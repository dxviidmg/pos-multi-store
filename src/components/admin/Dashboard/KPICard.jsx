import React from "react";
import { Box, Grid, Typography } from "@mui/material";

const KPI_ITEM_PROPS = { xs: 6, md: 3 };

/** Tarjeta de indicador de los tableros dentro de su `Grid item`. */
const KPICard = ({ title, value, subtitle, icon: Icon, index = 0, itemProps = KPI_ITEM_PROPS }) => (
  <Grid item {...itemProps}>
    <Box className="card card-interactive" sx={{ height: "100%", mb: 0 }}>
      <Box className="fade-in-up" sx={{ height: "100%", animationDelay: `${index * 60}ms` }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box sx={{ flex: 1 }}>
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
          {Icon && <Icon sx={{ fontSize: 22, color: "text.secondary" }} />}
        </Box>
      </Box>
    </Box>
  </Grid>
);

export default KPICard;
