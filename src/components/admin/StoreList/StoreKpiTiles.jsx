import React, { memo } from "react";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { formatCurrency, formatNumber } from "../../../utils/currency";
import { colors } from "../../../theme/colors";

const [BLUE, GREEN, SKY, AMBER] = colors.kpiTones;

const KPI_TILES = [
  { label: "Productos", tone: BLUE, getValue: ({ tenantInfo }) => formatNumber(tenantInfo.product_count) },
  { label: "Ventas", tone: GREEN, getValue: ({ totals }) => formatNumber(totals.total_sales) },
  { label: "Monto vendido", tone: SKY, getValue: ({ totals }) => formatCurrency(totals.total_day) },
  { label: "Ganancia", tone: AMBER, getValue: ({ totals }) => formatCurrency(totals.profit) },
];

const StoreKpiTiles = ({ tenantInfo, totals, loading }) => (
  <Grid container spacing={2} sx={{ mb: 3 }}>
    {KPI_TILES.map(({ label, tone, getValue }) => (
        <Grid item xs={6} md={3} key={label}>
          <Box sx={{ height: "100%", px: 2.5, py: 2, bgcolor: (theme) => alpha(tone, theme.palette.mode === "dark" ? 0.16 : 0.1), border: "1px solid", borderColor: (theme) => alpha(tone, 0.2), borderRadius: 3 }}>
            <Typography variant="caption" component="div" sx={{ fontWeight: 500, color: "text.secondary" }}>{label}</Typography>
            {loading ? (
              <Skeleton variant="rounded" width={96} height={34} sx={{ mt: 0.5 }} />
            ) : (
              <Typography variant="h3" component="div" sx={{ mt: 0.25, fontVariantNumeric: "tabular-nums" }}>
                {getValue({ tenantInfo, totals })}
              </Typography>
            )}
          </Box>
        </Grid>
    ))}
  </Grid>
);

export default memo(StoreKpiTiles);
