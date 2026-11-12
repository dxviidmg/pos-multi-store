import React, { useMemo } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import TodayReferenceLine from "./TodayReferenceLine";
import { getStoreSeries } from "./chartData";
import { CHART_LEGEND_TOP, CHART_MARGIN, CHART_TICK_STYLE } from "./chartStyles";

/** Barras agrupadas por sucursal (por mes o por día del mes). */
const MainBarChart = ({ data, metricType, labels, dataType, daysInMonth, todayLabel }) => {
  const series = useMemo(
    () => getStoreSeries(data, dataType, metricType, daysInMonth),
    [data, dataType, metricType, daysInMonth]
  );
  if (!series.length) return null;

  return (
    <BarChart
      xAxis={[{ data: labels, scaleType: "band", tickLabelStyle: CHART_TICK_STYLE }]}
      yAxis={[{ min: 0, tickLabelStyle: CHART_TICK_STYLE }]}
      series={series}
      height={300}
      margin={CHART_MARGIN}
      borderRadius={4}
      slotProps={{ legend: CHART_LEGEND_TOP }}
      grid={{ horizontal: true }}
    >
      {todayLabel && <TodayReferenceLine x={todayLabel} />}
    </BarChart>
  );
};

export default MainBarChart;
