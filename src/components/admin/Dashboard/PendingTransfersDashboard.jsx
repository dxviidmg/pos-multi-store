import React, { useEffect, useCallback, useMemo } from "react";
import useTaskPolling from "../../../hooks/useTaskPolling";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import EmptyState from "../../ui/EmptyState/EmptyState";
import DoughnutChart from "./DoughnutChart";
import DashboardLoading from "./DashboardLoading";
import StatCard from "./StatCard";
import { BarChart } from "@mui/x-charts/BarChart";
import { Grid, Box, Typography, useTheme } from "@mui/material";
import { exportToExcel } from "../../../utils/excel";
import { getPendingTransfersDashboard } from "../../../api/dashboards";
import { CHART_LEGEND_TOP, CHART_TICK_STYLE } from "./chartStyles";
import WarningIcon from "@mui/icons-material/Warning";
import InventoryIcon from "@mui/icons-material/Inventory";
import DownloadIcon from "@mui/icons-material/Download";

const TITLE = "Traspasos pendientes";

const STAT_ITEM_PROPS = { xs: 12, sm: 6, md: 6 };

const BAR_MARGIN = { top: 50, bottom: 40, left: 70, right: 10 };

const DESCRIPTION = "En SmartVenta sabemos que la precisión en tu operación diaria marca la diferencia. Aunque las inconsistencias o duplicidades en los traspasos no son frecuentes, cuando llegan a presentarse estamos atentos para detectarlas y ayudarte a resolverlas de forma rápida y confiable. Porque para nosotros, cuidar tus datos no es solo una función del sistema, es un compromiso con tu tranquilidad y la continuidad de tu negocio.";

const COLUMNS = [
  { name: "Fecha", selector: (row) => row.Fecha },
  { name: "Tienda solicitante", selector: (row) => row["Tienda solicitante"] },
  { name: "Tienda proveedora", selector: (row) => row["Tienda proveedora"] },
  { name: "Producto", selector: (row) => row.Producto },
  { name: "Marca", selector: (row) => row.Marca },
  { name: "Cantidad", selector: (row) => row.Cantidad },
];

const PendingTransfersDashboard = () => {
  const theme = useTheme();

  const startTask = useCallback(async () => {
    const response = await getPendingTransfersDashboard();
    return response.data.task;
  }, []);

  const { data, loading, progress, countdown, fetchData } = useTaskPolling(startTask);

  useEffect(() => { fetchData(); }, [fetchData]);

  const transfers = useMemo(() => data?.transfers?.map(t => ({
    "Tienda solicitante": t.destination_store,
    "Tienda proveedora": t.origin_store,
    Cantidad: t.quantity,
    Producto: t.product,
    Marca: t.brand,
    Fecha: new Date(t.created_at).toLocaleDateString(),
  })), [data]);

  const kpis = useMemo(() => {
    if (!data?.transfers?.length) return null;
    const total = data.transfers.length;
    const totalStores = data.stores?.length || 0;
    return {
      total,
      avgPerStore: totalStores > 0 ? Math.round(total / totalStores) : 0,
    };
  }, [data]);

  const chartData = useMemo(() => {
    if (!data?.transfers) return null;
    return { sales: data.transfers.map(t => ({ store_name: t.destination_store })) };
  }, [data]);

  const barChartSeries = useMemo(() => {
    if (!data?.transfers || !data?.stores) return [];
    const today = new Date().toDateString();
    const byStore = {};
    data.stores.forEach(s => { byStore[s.name] = { hoy: 0, anteriores: 0 }; });
    data.transfers.forEach(t => {
      const store = t.destination_store;
      if (byStore[store]) {
        if (new Date(t.created_at).toDateString() === today) byStore[store].hoy++;
        else byStore[store].anteriores++;
      }
    });
    const storeNames = data.stores.map(s => s.name);
    return [
      { data: storeNames.map(s => byStore[s]?.hoy || 0), label: "Hoy", color: theme.palette.success.main },
      { data: storeNames.map(s => byStore[s]?.anteriores || 0), label: "Anteriores", color: theme.palette.error.main },
    ];
  }, [data, theme]);

  const storeNames = useMemo(() => data?.stores?.map(s => s.name) || [], [data]);

  const handleDownload = useCallback(() => {
    exportToExcel(transfers, "Traspasos pendientes");
  }, [transfers]);

  if (loading) {
    return <DashboardLoading title={TITLE} progress={progress} countdown={countdown} />;
  }

  if (!kpis) {
    return (
      <Box>
        <Box className="card" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{TITLE}</Typography>
          <Typography variant="body2" color="text.secondary">{DESCRIPTION}</Typography>
        </Box>
        <EmptyState message="No hay traspasos pendientes" />
      </Box>
    );
  }

  return (
    <Box>
      <Box className="card" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{TITLE}</Typography>
        <Typography variant="body2" color="text.secondary">{DESCRIPTION}</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <StatCard icon={WarningIcon} iconColor="warning.main" label="Traspasos pendientes" value={kpis.total} itemProps={STAT_ITEM_PROPS} />
        <StatCard icon={InventoryIcon} iconColor="primary.main" label="Promedio por tienda" value={kpis.avgPerStore} itemProps={STAT_ITEM_PROPS} />
      </Grid>

      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid item xs={12} md={6}>
          <Box className="card" sx={{ height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: "text.primary" }}>
              Traspasos por tienda (Hoy vs Anteriores)
            </Typography>
            <BarChart
              xAxis={[{ data: storeNames, scaleType: "band", tickLabelStyle: CHART_TICK_STYLE }]}
              yAxis={[{ tickLabelStyle: CHART_TICK_STYLE }]}
              series={barChartSeries}
              height={300}
              margin={BAR_MARGIN}
              borderRadius={4}
              slotProps={{ legend: CHART_LEGEND_TOP }}
              grid={{ horizontal: true }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box className="card" sx={{ height: "100%" }}>
            {chartData && <DoughnutChart title="Traspasos pendientes por tienda" data={chartData} dataType="store" />}
          </Box>
        </Grid>
      </Grid>

      <Box className="card" sx={{ mb: 0, mt: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Traspasos pendientes</Typography>
          <CustomButton onClick={handleDownload} disabled={!transfers?.length} startIcon={<DownloadIcon />}>
            Descargar
          </CustomButton>
        </Box>
        <DataTable
          progressPending={loading}
          noDataComponent="Sin traspasos pendientes"
          searcher
          data={transfers || []}
          columns={COLUMNS}
        />
      </Box>
    </Box>
  );
};

export default PendingTransfersDashboard;
