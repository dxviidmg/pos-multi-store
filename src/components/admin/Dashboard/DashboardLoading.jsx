import React from "react";
import { Box, Grid, LinearProgress, Skeleton, Typography } from "@mui/material";
import CountdownTimer from "../../ui/CountdownTimer";

const KPI_ITEM_PROPS = { xs: 12, sm: 6, md: 3 };
const SKELETON_SX = { borderRadius: "14px" };

/**
 * Estado de carga de un tablero mientras corre la tarea: título, progreso,
 * cuenta regresiva y esqueletos de KPIs (y de gráficas con `chartCount`).
 */
const DashboardLoading = ({ title, progress, countdown, kpiCount = 4, kpiItemProps = KPI_ITEM_PROPS, chartCount = 0, showPercent }) => (
  <Box>
    <Box className="card" sx={{ mb: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Procesando datos...</Typography>
      <LinearProgress
        variant={progress > 0 ? "determinate" : "indeterminate"}
        value={progress}
        sx={{ height: 6, borderRadius: 3, mb: 1 }}
      />
      {showPercent ? (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {progress > 0 && <Typography variant="caption" color="text.secondary">{Math.round(progress)}% completado</Typography>}
          <CountdownTimer seconds={countdown} />
        </Box>
      ) : (
        <CountdownTimer seconds={countdown} />
      )}
    </Box>
    <Grid container spacing={2} sx={chartCount ? { mb: 3 } : undefined}>
      {Array.from({ length: kpiCount }, (_, i) => (
        <Grid item {...kpiItemProps} key={i}>
          <Skeleton variant="rounded" height={120} sx={SKELETON_SX} />
        </Grid>
      ))}
    </Grid>
    {chartCount > 0 && (
      <Grid container spacing={3}>
        {Array.from({ length: chartCount }, (_, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Skeleton variant="rounded" height={350} sx={SKELETON_SX} />
          </Grid>
        ))}
      </Grid>
    )}
  </Box>
);

export default DashboardLoading;
