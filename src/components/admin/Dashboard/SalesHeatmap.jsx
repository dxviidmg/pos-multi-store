import React, { useMemo } from "react";
import { Box, Typography, Tooltip, useTheme, alpha } from "@mui/material";
import { DAY_NAMES_SHORT } from "../../../utils/date";
import { formatCurrency } from "../../../utils/currency";
import { CHART_COLORS } from "../../../utils/chart";

const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const LEGEND_STEPS = [0, 0.25, 0.5, 0.75, 1];

// Mismo color por sucursal que el resto de las gráficas del tablero
const getStoreColor = (index) => CHART_COLORS[index % CHART_COLORS.length];


const SalesHeatmap = ({ data, metricType = "count" }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  // Celdas vacías y leyenda: blanco translúcido en oscuro, negro translúcido en claro
  const neutral = isDark ? theme.palette.common.white : theme.palette.common.black;

  const { storeGrids, globalMax } = useMemo(() => {
    if (!data?.sales?.length || !data?.stores?.length) return { storeGrids: [], globalMax: 0 };

    const grids = data.stores.map((store) => {
      const g = Array.from({ length: 7 }, () => Array(24).fill(0));
      let max = 0;
      data.sales.forEach((s) => {
        if (s.store_name !== store.name) return;
        const d = new Date(s.created_at);
        const val = metricType === "total" ? (s.total || 0) : 1;
        g[d.getDay()][d.getHours()] += val;
      });
      g.forEach((row) => row.forEach((v) => { if (v > max) max = v; }));
      return { name: store.name, grid: g, max };
    });

    const gMax = Math.max(...grids.map((g) => g.max), 1);
    return { storeGrids: grids, globalMax: gMax };
  }, [data, metricType]);

  const formatValue = (v) =>
    metricType === "total" ? formatCurrency(v, 0) : v;

  const getColor = (value, colorIdx) => {
    if (!globalMax || !value) return alpha(neutral, 0.04);
    const intensity = value / globalMax;
    const color = getStoreColor(colorIdx);
    return isDark
      ? alpha(color, 0.12 + intensity * 0.88)
      : alpha(color, 0.08 + intensity * 0.82);
  };

  if (!storeGrids.length) return null;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: "text.primary" }}>
        Mapa de calor — Ventas por día y hora
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {storeGrids.map((store, si) => (
          <Box key={store.name}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: getStoreColor(si) }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{store.name}</Typography>
            </Box>
            <Box sx={{ overflowX: "auto" }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "48px repeat(24, 1fr)", gap: "2px", minWidth: 500 }}>
                <Box />
                {HOUR_LABELS.map((h, i) =>
                  i % 3 === 0 ? (
                    <Typography key={i} variant="caption" sx={{ textAlign: "center", color: "text.secondary", fontSize: 9 }}>
                      {h}
                    </Typography>
                  ) : <Box key={i} />
                )}
                {DAY_NAMES_SHORT.map((day, di) => (
                  <React.Fragment key={di}>
                    <Typography variant="caption" sx={{ display: "flex", alignItems: "center", fontWeight: 600, color: "text.secondary", fontSize: 10 }}>
                      {day}
                    </Typography>
                    {store.grid[di].map((val, hi) => (
                      <Tooltip key={hi} title={`${store.name} · ${day} ${hi}:00 — ${formatValue(val)}`} arrow placement="top">
                        <Box sx={{
                          aspectRatio: "1",
                          borderRadius: "2px",
                          bgcolor: getColor(val, si),
                          cursor: "pointer",
                          transition: "transform 0.15s ease",
                          "&:hover": { transform: "scale(1.4)", zIndex: 1 },
                        }} />
                      </Tooltip>
                    ))}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5, mt: 2 }}>
        <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 10, mr: 0.5 }}>Menos</Typography>
        {LEGEND_STEPS.map((intensity) => (
          <Box key={intensity} sx={{
            width: 12, height: 12, borderRadius: "2px",
            bgcolor: alpha(neutral, 0.04 + intensity * (isDark ? 0.5 : 0.4)),
          }} />
        ))}
        <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 10, ml: 0.5 }}>Más</Typography>
      </Box>
    </Box>
  );
};

export default SalesHeatmap;
