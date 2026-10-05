import React from "react";
import { useTheme } from "@mui/material";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";

/** Línea vertical punteada "Hoy" sobre el eje X de las gráficas por día. */
const TodayReferenceLine = ({ x }) => {
  const theme = useTheme();
  const color = theme.palette.error.main;

  return (
    <ChartsReferenceLine
      x={x}
      lineStyle={{ stroke: color, strokeWidth: 2, strokeDasharray: "6 3" }}
      labelStyle={{ fill: color, fontSize: 11, fontWeight: 600 }}
      label="Hoy"
    />
  );
};

export default TodayReferenceLine;
