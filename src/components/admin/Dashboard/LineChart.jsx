import React, { useMemo } from "react";
import { LineChart as MuiLineChart } from "@mui/x-charts/LineChart";
import { Box, Typography } from "@mui/material";
import TodayReferenceLine from "./TodayReferenceLine";
import { getStoreSeries } from "./chartData";
import { CHART_AXIS_LABEL_STYLE, CHART_LEGEND_TOP, CHART_MARGIN, CHART_TICK_STYLE } from "./chartStyles";

const LINE_SX = {
  "& .MuiLineElement-root": {
    strokeWidth: 2.5,
  },
  "& .MuiMarkElement-root": {
    scale: "0.8",
    strokeWidth: 2,
  },
};

const LineChart = ({ title, data, labels, xText, dataType, metricType = "count", todayLabel }) => {
  const series = useMemo(() => {
    if (!data) return [];
    return getStoreSeries(data, dataType, metricType, labels?.length || 31).map((s) => ({
      ...s,
      curve: "catmullRom",
      showMark: true,
      area: false,
    }));
  }, [data, dataType, metricType, labels]);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: "text.primary" }}>
        {title}
      </Typography>
      <MuiLineChart
        xAxis={[{
          data: labels || [],
          scaleType: "point",
          label: xText,
          labelStyle: CHART_AXIS_LABEL_STYLE,
          tickLabelStyle: CHART_TICK_STYLE,
        }]}
        yAxis={[{
          min: 0,
          labelStyle: CHART_AXIS_LABEL_STYLE,
          tickLabelStyle: CHART_TICK_STYLE,
        }]}
        series={series}
        height={300}
        margin={CHART_MARGIN}
        slotProps={{ legend: CHART_LEGEND_TOP }}
        grid={{ vertical: true, horizontal: true }}
        sx={LINE_SX}
      >
        {todayLabel && <TodayReferenceLine x={todayLabel} />}
      </MuiLineChart>
    </Box>
  );
};

export default LineChart;
