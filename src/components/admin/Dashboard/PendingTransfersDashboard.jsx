import React, { useEffect, useCallback, useMemo } from "react";
import useTaskPolling from "../../../hooks/useTaskPolling";
import CountdownTimer from "../../ui/CountdownTimer";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import DoughnutChart from "./DoughnutChart";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  Grid, Box, Typography,
  LinearProgress, Skeleton,
} from "@mui/material";
import { exportToExcel } from "../../../utils/utils";
import httpClient from "../../../api/httpClient";
import { getApiUrl } from "../../../api/utils";
import WarningIcon from "@mui/icons-material/Warning";
import InventoryIcon from "@mui/icons-material/Inventory";
import DownloadIcon from "@mui/icons-material/Download";
import InboxIcon from "@mui/icons-material/Inbox";

const PendingTransfersDashboard = () => {
  const startTask = useCallback(async () => {
    const url = getApiUrl("pending-transfers-dashboard");
    console.log("Pending Transfers URL:", url.toString());
    const response = await httpClient.get(url);
    return response.data.task;
  }, []);

  const { data, loading, progress, countdown, fetchData } = useTaskPolling(startTask);

  useEffect(() => { fetchData(); }, [fetchData]);

  const calculateKPIs = () => {
    if (!data?.transfers?.length) return null;
    const transfers = data.transfers;
    const total = transfers.length;
    const totalStores = data.stores?.length || 0;
    const avgPerStore = totalStores > 0 ? Math.round(total / totalStores) : 0;

    const today = new Date().toDateString();
    const todayTransfers = transfers.filter(t => new Date(t.created_at).toDateString() === today).length;
    const olderTransfers = total - todayTransfers;

    return { total, avgPerStore, todayTransfers, olderTransfers };
  };

  const kpis = calculateKPIs();

  const handleDownload = () => {
    const exportData = data?.transfers?.map(t => ({
      "Tienda solcitante": t.destination_store,
      Cantidad: t.quantity,
      Producto: t.product,
      Marca: t.brand,
      Fecha: new Date(t.created_at).toLocaleDateString(),
    })) || [];
    exportToExcel(exportData, `Traspasos pendientes`);
  };

  const chartData = useMemo(() => {
    if (!data?.transfers) return null;
    return {
      sales: data.transfers.map(t => ({
        store_name: t.destination_store,
      })),
    };
  }, [data]);

  if (loading) {
    return (
      <Box>
        <Box className="card" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Traspasos Pendientes</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Procesando datos...</Typography>
          <LinearProgress variant={progress > 0 ? "determinate" : "indeterminate"} value={progress} sx={{ height: 6, borderRadius: 3, mb: 1 }} />
          <CountdownTimer seconds={countdown} />
        </Box>
        <Grid container spacing={2}>
          {[0,1,2,3].map(i => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: "14px" }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!kpis) {
    return (
      <Box>
        <Box className="card" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Traspasos Pendientes</Typography>
          <Typography variant="body2" color="text.secondary">
            En SmartVenta sabemos que la precisión en tu operación diaria marca la diferencia. Aunque las inconsistencias o duplicidades en los traspasos no son frecuentes, cuando llegan a presentarse estamos atentos para detectarlas y ayudarte a resolverlas de forma rápida y confiable. Porque para nosotros, cuidar tus datos no es solo una función del sistema, es un compromiso con tu tranquilidad y la continuidad de tu negocio.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 350, gap: 2, opacity: 0.7 }}>
          <InboxIcon sx={{ fontSize: 64, color: "text.secondary" }} />
          <Typography variant="h6" color="text.secondary">No hay traspasos pendientes</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box className="card" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Traspasos Pendientes</Typography>
        <Typography variant="body2" color="text.secondary">
        En SmartVenta sabemos que la precisión en tu operación diaria marca la diferencia. Aunque las inconsistencias o duplicidades en los traspasos no son frecuentes, cuando llegan a presentarse estamos atentos para detectarlas y ayudarte a resolverlas de forma rápida y confiable. Porque para nosotros, cuidar tus datos no es solo una función del sistema, es un compromiso con tu tranquilidad y la continuidad de tu negocio.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={6}>
          <Box className="card" sx={{ height: "100%", mb: 0, display: "flex", alignItems: "center", gap: 2 }}>
            <WarningIcon sx={{ fontSize: 32, color: "warning.main" }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Traspasos pendientes</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{kpis.total}</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Box className="card" sx={{ height: "100%", mb: 0, display: "flex", alignItems: "center", gap: 2 }}>
            <InventoryIcon sx={{ fontSize: 32, color: "primary.main" }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Promedio por tienda</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{kpis.avgPerStore}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid item xs={12} md={6}>
          <Box className="card" sx={{ height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: "text.primary" }}>
              Traspasos por tienda (Hoy vs Anteriores)
            </Typography>
            <BarChart
              xAxis={[{ 
                data: data?.stores?.map(s => s.name) || [],
                scaleType: "band",
                tickLabelStyle: { fontSize: 11, fill: "#64748b" }
              }]}
              yAxis={[{ tickLabelStyle: { fontSize: 11, fill: "#64748b" } }]}
              series={(() => {
                const today = new Date().toDateString();
                const byStore = {};
                data?.stores?.forEach(s => { byStore[s.name] = { Hoy: 0, Anteriores: 0 }; });
                data?.transfers?.forEach(t => {
                  const store = t.destination_store;
                  if (byStore[store]) {
                    if (new Date(t.created_at).toDateString() === today) {
                      byStore[store].Hoy += 1;
                    } else {
                      byStore[store].Anteriores += 1;
                    }
                  }
                });
                const storeNames = data?.stores?.map(s => s.name) || [];
                return [
                  { data: storeNames.map(s => byStore[s]?.Hoy || 0), label: "Hoy", color: "#4caf50" },
                  { data: storeNames.map(s => byStore[s]?.Anteriores || 0), label: "Anteriores", color: "#f44336" }
                ];
              })()}
              height={300}
              margin={{ top: 50, bottom: 40, left: 70, right: 10 }}
              borderRadius={4}
              slotProps={{
                legend: { direction: "row", position: { vertical: "top", horizontal: "middle" }, padding: 0 },
              }}
              grid={{ horizontal: true }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box className="card" sx={{ height: "100%" }}>
            {chartData && <DoughnutChart 
              title="Traspasos pendientes por tienda" 
              data={chartData} 
              dataType="store" 
            />}
          </Box>
        </Grid>
      </Grid>

      <Box className="card" sx={{ mb: 0, mt: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Traspasos Pendientes</Typography>
          <CustomButton onClick={handleDownload} disabled={!data?.transfers?.length} startIcon={<DownloadIcon />} size="small">
            Descargar
          </CustomButton>
        </Box>
        <DataTable
          progressPending={loading}
          noDataComponent="Sin traspasos pendientes"
          searcher={true}
          data={data?.transfers || []}
          columns={[
            { name: "Fecha", selector: (row) => new Date(row.created_at).toLocaleDateString() },
            { name: "Tienda solicitante", selector: (row) => row.destination_store },
            { name: "Producto", selector: (row) => row.product },
            { name: "Marca", selector: (row) => row.brand },
            { name: "Cantidad", selector: (row) => row.quantity },
          ]}
        />
      </Box>
    </Box>
  );
};

export default PendingTransfersDashboard;
