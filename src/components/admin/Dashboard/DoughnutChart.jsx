import React, { useMemo } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography, useTheme } from "@mui/material";
import { CHART_COLORS } from "../../../utils/chart";

// Campo de agrupación y etiqueta cuando falta, por tipo de gráfica
const GROUP_BY = {
  payment: { key: "payment_method", fallback: "Sin método" },
  store: { key: "store_name", fallback: "Sin tienda" },
};

const LEGEND = {
  direction: "column",
  position: { vertical: "middle", horizontal: "right" },
  padding: 0,
  itemMarkWidth: 12,
  itemMarkHeight: 12,
  markGap: 8,
  itemGap: 10,
  labelStyle: {
    fontSize: 13,
    fill: "var(--color-text-secondary)",
  },
};

const MARGIN = { top: 10, bottom: 10, left: 10, right: 10 };

const groupSales = (result, dataType, metricType) => {
  const groupBy = GROUP_BY[dataType];
  if (!groupBy || !result?.sales?.length) return [];

  const grouped = {};
  result.sales.forEach((item) => {
    const key = item[groupBy.key] || groupBy.fallback;
    grouped[key] = (grouped[key] || 0) + (metricType === "total" ? (item.total || 0) : 1);
  });
  const total = Object.values(grouped).reduce((sum, value) => sum + value, 0);

  return Object.entries(grouped).map(([label, value], index) => ({
    id: index,
    value,
    label: `${label} (${total ? ((value / total) * 100).toFixed(1) : 0}%)`,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));
};

const DoughnutChart = ({ title, data, dataType, metricType = "count" }) => {
  const theme = useTheme();
  const chartData = useMemo(() => groupSales(data, dataType, metricType), [data, dataType, metricType]);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: "text.primary" }}>
        {title}
      </Typography>
      <PieChart
        series={[
          {
            data: chartData,
            innerRadius: 65,
            outerRadius: 105,
            paddingAngle: 1,
            cornerRadius: 4,
            highlightScope: { faded: "global", highlighted: "item" },
            faded: { innerRadius: 60, additionalRadius: -5, color: "gray" },
          },
        ]}
        height={300}
        margin={MARGIN}
        slotProps={{ legend: LEGEND }}
        sx={{
          "& .MuiPieArc-root": {
            stroke: theme.palette.background.paper,
            strokeWidth: 2,
          },
        }}
      />
    </Box>
  );
};

export default DoughnutChart;
