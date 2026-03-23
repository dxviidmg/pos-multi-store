import React, { useMemo } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Typography } from "@mui/material";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];
const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const AvgTicketChart = ({ data }) => {
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

    return data.stores.map((store, i) => ({
      data: grouped[store.name].map((d) => d.count ? Math.round((d.total / d.count) * 100) / 100 : 0),
      label: store.name,
      color: COLORS[i % COLORS.length],
    }));
  }, [data]);

  if (!series.length) return null;

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: "text.primary" }}>
        Ticket promedio por día de la semana
      </Typography>
      <BarChart
        xAxis={[{ data: DAY_NAMES, scaleType: "band", tickLabelStyle: { fontSize: 11, fill: "#64748b" } }]}
        yAxis={[{ tickLabelStyle: { fontSize: 11, fill: "#64748b" } }]}
        series={series}
        height={300}
        margin={{ top: 50, bottom: 40, left: 70, right: 10 }}
        borderRadius={4}
        slotProps={{
          legend: { direction: "row", position: { vertical: "top", horizontal: "middle" }, padding: 0 },
        }}
        grid={{ horizontal: true }}
      />
    </Box>
  );
};

export default AvgTicketChart;
