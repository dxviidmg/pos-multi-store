import React, { useMemo } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Typography } from "@mui/material";
import { CHART_COLORS } from "../../../utils/chart";
import { DAY_NAMES_SHORT } from "../../../utils/date";
import { CHART_LEGEND_TOP, CHART_TICK_STYLE } from "./chartStyles";

const AVG_TICKET_MARGIN = { top: 50, bottom: 40, left: 70, right: 10 };

const AvgTicketChart = ({ data, metricType }) => {
  const isPrimaryAmount = metricType === "total";

  const series = useMemo(() => {
    if (!data?.sales?.length || !data?.stores?.length) return [];

    const grouped = {};
    data.stores.forEach((s) => { grouped[s.name] = Array.from({ length: 7 }, () => ({ total: 0, count: 0 })); });

    data.sales.forEach((s) => {
      if (!grouped[s.store_name]) return;
      const day = new Date(s.created_at).getDay();
      grouped[s.store_name][day].total += s.total || 0;
      grouped[s.store_name][day].count += 1;
    });

    const weeks = Math.ceil(new Date(data.sales[0].created_at).getDate() / 7);

    return data.stores.map((store, i) => ({
      data: grouped[store.name].map((d) => {
        if (!d.count) return 0;
        const value = isPrimaryAmount ? d.total / d.count : d.count / weeks;
        return Math.round(value * 100) / 100;
      }),
      label: store.name,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));
  }, [data, isPrimaryAmount]);

  if (!series.length) return null;

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: "text.primary" }}>
        {isPrimaryAmount ? "Ticket promedio" : "Transacciones"} por día de la semana
      </Typography>
      <BarChart
        xAxis={[{ data: DAY_NAMES_SHORT, scaleType: "band", tickLabelStyle: CHART_TICK_STYLE }]}
        yAxis={[{ tickLabelStyle: CHART_TICK_STYLE }]}
        series={series}
        height={300}
        margin={AVG_TICKET_MARGIN}
        borderRadius={4}
        slotProps={{ legend: CHART_LEGEND_TOP }}
        grid={{ horizontal: true }}
      />
    </Box>
  );
};

export default AvgTicketChart;
