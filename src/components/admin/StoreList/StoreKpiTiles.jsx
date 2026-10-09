import React, { memo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { formatCurrency, formatNumber } from "../../../utils/currency";
import { colors } from "../../../theme/colors";

const [BLUE, GREEN, SKY, AMBER] = colors.kpiTones;

const KPI_TILES = [
  { label: "# Productos", Icon: Inventory2OutlinedIcon, tone: BLUE, getValue: ({ tenantInfo }) => formatNumber(tenantInfo.product_count) },
  { label: "Ventas totales", Icon: ReceiptLongOutlinedIcon, tone: GREEN, getValue: ({ totals }) => formatNumber(totals.total_sales) },
  { label: "Monto total", Icon: PaymentsOutlinedIcon, tone: SKY, getValue: ({ totals }) => formatCurrency(totals.total_day) },
  { label: "Ganancia total", Icon: TrendingUpIcon, tone: AMBER, getValue: ({ totals }) => formatCurrency(totals.profit) },
];

const StoreKpiTiles = ({ tenantInfo, totals }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    {KPI_TILES.map(({ label, Icon, tone, getValue }) => (
      <Grid item xs={12} sm={6} md={3} key={label}>
        <Box
          sx={{
            display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.5,
            bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 1.5,
          }}
        >
          <Box sx={{ width: 38, height: 38, borderRadius: 1.25, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: alpha(tone, 0.12), color: tone, flexShrink: 0 }}>
            <Icon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" component="div" sx={{ fontWeight: 500 }}>{label}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: "1.25rem", lineHeight: 1.3, fontVariantNumeric: "tabular-nums" }}>
              {getValue({ tenantInfo, totals })}
            </Typography>
          </Box>
        </Box>
      </Grid>
    ))}
  </Grid>
);

export default memo(StoreKpiTiles);
