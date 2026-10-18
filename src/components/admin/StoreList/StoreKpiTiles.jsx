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
  const noSales = !Number(totals.total_day);

  return (
    <Box
      sx={{
        position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: 0.5,
        p: 2.5, borderRadius: CARD_RADIUS, bgcolor: tokens.heroBg, color: "common.white",
        "&::before": {
          content: '""', position: "absolute", top: -70, right: -70, width: 220, height: 220, borderRadius: "50%",
          background: `radial-gradient(circle, ${tokens.heroGlow} 0%, transparent 70%)`,
        },
        "& > *": { position: "relative" },
      }}
    >
      <Typography variant="body2" sx={{ color: tokens.heroLabel }}>{`Monto vendido ${noun}`}</Typography>
      {loading ? (
        <Skeleton variant="rounded" width={160} height={44} sx={{ bgcolor: tokens.heroDivider }} />
      ) : (
        <Typography component="div" sx={{ fontSize: "2.25rem", fontWeight: 600, lineHeight: 1.2, fontVariantNumeric: "tabular-nums" }}>
          {formatCurrency(totals.total_day)}
        </Typography>
      )}
      {!loading && noSales && <Typography variant="body2" sx={{ color: tokens.heroLabel }}>{`Aún no hay ventas ${noun}`}</Typography>}

      <Box sx={{ mt: "auto", pt: 1.5, borderTop: `1px solid ${tokens.heroDivider}`, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
        {PAYMENT_METHOD_OPTIONS.map(({ value, label }) => (
          <Box key={value}>
            <Typography component="div" sx={{ fontSize: "0.72rem", color: tokens.heroLabel }}>{label}</Typography>
            <Typography component="div" sx={{ fontSize: "0.875rem", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
              {loading ? "—" : formatCurrency(totals[value])}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const SIMPLE_TILES = [
  {
    label: "Ventas",
    getValue: ({ totals }) => formatNumber(totals.total_sales),
    getNote: () => "Tickets cobrados en el periodo",
  },
  {
    label: "Ganancia",
    getValue: ({ totals }) => formatCurrency(totals.profit),
    getNote: ({ totals }) => (Number(totals.profit) ? null : "Aparece con tu primera venta"),
  },
  {
    label: "Productos",
    getValue: ({ tenantInfo }) => formatNumber(tenantInfo.product_count),
    getNote: () => "Registrados en tu catálogo",
  },
];

const SimpleTile = ({ label, value, note, loading }) => (
  <Box sx={{ display: "flex", flexDirection: "column", p: 2.5, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: CARD_RADIUS }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    {loading ? (
      <Skeleton variant="rounded" width={96} height={38} sx={{ mt: 0.5 }} />
    ) : (
      <Typography component="div" sx={{ mt: 0.5, fontSize: "1.875rem", fontWeight: 600, lineHeight: 1.2, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </Typography>
    )}
    {!loading && note && (
      <>
        <Box sx={{ flex: 1, minHeight: 16 }} />
        <Box sx={{ pt: 1.25, borderTop: "1px dashed", borderColor: "divider" }}>
          <Typography variant="caption" sx={{ fontSize: "0.78rem" }}>{note}</Typography>
        </Box>
      </>
    )}
  </Box>
);

const StoreKpiTiles = ({ tenantInfo, totals, period, loading }) => (
  <Box sx={{ display: "grid", gap: 2, mb: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1.35fr 1fr 1fr 1fr" } }}>
    <AmountTile totals={totals} period={period} loading={loading} />
    {SIMPLE_TILES.map(({ label, getValue, getNote }) => (
      <SimpleTile
        key={label}
        label={label}
        value={getValue({ tenantInfo, totals })}
        note={getNote({ totals })}
        loading={loading}
      />
    ))}
  </Box>
);

export default memo(StoreKpiTiles);
