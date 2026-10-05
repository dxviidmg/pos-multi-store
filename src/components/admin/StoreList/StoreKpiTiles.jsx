import React, { memo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { formatCurrency, formatNumber } from "../../../utils/currency";

const KPI_TILES = [
  { label: "# Productos", getValue: ({ tenantInfo }) => formatNumber(tenantInfo.product_count) },
  { label: "Ventas totales", getValue: ({ totals }) => formatNumber(totals.total_sales) },
  { label: "Monto total", getValue: ({ totals }) => formatCurrency(totals.total_day) },
  { label: "Ganancia total", getValue: ({ totals }) => formatCurrency(totals.profit) },
];

const StoreKpiTiles = ({ tenantInfo, totals }) => (
  <Grid container spacing={2} sx={{ mb: 1 }}>
    {KPI_TILES.map(({ label, getValue }) => (
      <Grid item xs={12} sm={6} md={3} key={label}>
        <Box sx={{ bgcolor: "primary.main", p: 1, borderRadius: 1, textAlign: "center" }}>
          <Typography variant="caption" sx={{ color: "common.white", fontWeight: 600 }}>{label}</Typography>
          <Typography variant="h5" sx={{ color: "common.white", fontWeight: 700 }}>{getValue({ tenantInfo, totals })}</Typography>
        </Box>
      </Grid>
    ))}
  </Grid>
);

export default memo(StoreKpiTiles);
