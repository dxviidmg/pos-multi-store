import React, { memo } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import { PAYMENT_METHOD_OPTIONS } from "../../../constants";
import { formatCurrency, formatNumber } from "../../../utils/currency";
import { useThemeTokens } from "../../../theme";
import { PERIODS } from "./storeInsights";

const CARD_RADIUS = "14px";

/** Tarjeta destacada: monto vendido y su desglose por forma de pago. */
const AmountTile = ({ totals, period, loading }) => {
  const tokens = useThemeTokens();
  const noun = PERIODS[period].noun;

  return (
    <Box
      sx={{
        position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", columnGap: 3, rowGap: 1, flex: 1, px: 2, py: 1.25, borderRadius: CARD_RADIUS,
        bgcolor: tokens.heroBg, color: "common.white",
        "&::before": {
          content: '""', position: "absolute", top: -70, right: -70, width: 220, height: 220, borderRadius: "50%",
          background: `radial-gradient(circle, ${tokens.heroGlow} 0%, transparent 70%)`,
        },
        "& > *": { position: "relative" },
      }}
    >
      <Box>
        <Typography component="div" sx={{ fontSize: "0.75rem", color: tokens.heroLabel }}>
          {`Monto vendido ${noun}`}
        </Typography>
        {loading ? (
          <Skeleton variant="rounded" width={120} height={28} sx={{ bgcolor: tokens.heroDivider }} />
        ) : (
          <Typography component="div" sx={{ fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.2, fontVariantNumeric: "tabular-nums" }}>
            {formatCurrency(totals.total_day)}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        {PAYMENT_METHOD_OPTIONS.map(({ value, label }) => (
          <Box key={value}>
            <Typography component="div" sx={{ fontSize: "0.7rem", color: tokens.heroLabel }}>{label}</Typography>
            <Typography component="div" sx={{ fontSize: "0.8125rem", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
              {loading ? "—" : formatCurrency(totals[value])}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const SIMPLE_TILES = [
  { label: "Ventas", getValue: ({ totals }) => formatNumber(totals.total_sales) },
  { label: "Ganancia", getValue: ({ totals }) => formatCurrency(totals.profit) },
  { label: "Productos", getValue: ({ tenantInfo }) => formatNumber(tenantInfo.product_count) },
];

const SimpleTile = ({ label, value, loading }) => (
  <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", px: 2, py: 1.25, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: CARD_RADIUS }}>
    <Typography sx={{ fontSize: "0.75rem" }} color="text.secondary">{label}</Typography>
    {loading ? (
      <Skeleton variant="rounded" width={80} height={28} />
    ) : (
      <Typography component="div" sx={{ fontSize: "1.375rem", fontWeight: 600, lineHeight: 1.2, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </Typography>
    )}
  </Box>
);

const StoreKpiTiles = ({ tenantInfo, totals, period, loading }) => (
  <Box sx={{ display: "grid", gap: 1.5, mb: 2, gridTemplateColumns: { xs: "1fr 1fr 1fr", md: "2.6fr 1fr 1fr 1fr" } }}>
    <Box sx={{ gridColumn: { xs: "1 / -1", md: "auto" }, display: "flex" }}>
      <AmountTile totals={totals} period={period} loading={loading} />
    </Box>
    {SIMPLE_TILES.map(({ label, getValue }) => (
      <SimpleTile key={label} label={label} value={getValue({ tenantInfo, totals })} loading={loading} />
    ))}
  </Box>
);

export default memo(StoreKpiTiles);
