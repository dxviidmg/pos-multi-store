import React, { useEffect, useState, useCallback, useMemo } from "react";
import useTaskPolling from "../../../hooks/useTaskPolling";
import CountdownTimer from "../../ui/CountdownTimer";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import DoughnutChart from "./DoughnutChart";
import {
  Grid, FormControl, InputLabel, Select, MenuItem, Box, Typography,
  LinearProgress, Skeleton, Chip,
} from "@mui/material";
import { MONTH_NAMES, exportToExcel } from "../../../utils/utils";
import httpClient from "../../../api/httpClient";
import { getApiUrl, buildUrlWithParams } from "../../../api/utils";
import WarningIcon from "@mui/icons-material/Warning";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InventoryIcon from "@mui/icons-material/Inventory";
import DownloadIcon from "@mui/icons-material/Download";
import InboxIcon from "@mui/icons-material/Inbox";

const StockVerificationDashboard = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const startTask = useCallback(async () => {
    const url = buildUrlWithParams(getApiUrl("stock-verification-dashboard"), { year, month });
    console.log("Stock Verification URL:", url.toString());
    const response = await httpClient.get(url);
    return response.data.task;
  }, [year, month]);

  const { data, loading, progress, countdown, fetchData } = useTaskPolling(startTask);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, [year, month]);

  const calculateKPIs = () => {
    if (!data?.store_products?.length) return null;
    const products = data.store_products;
    const total = data.total || 0;
    const totalStoreProducts = data.total_store_products || 0;
    const percentage = totalStoreProducts > 0 ? ((total / totalStoreProducts) * 100).toFixed(1) : 0;

    const byStore = {};
    if (data.stores) data.stores.forEach(s => { byStore[s.name] = 0; });
    products.forEach(p => { byStore[p.store_name] = (byStore[p.store_name] || 0) + 1; });
    const storeEntries = Object.entries(byStore).filter(([, v]) => v > 0);
    const avgPerStore = storeEntries.length > 0 ? Math.round(total / storeEntries.length) : 0;
 
    const byBrand = {};
    products.forEach(p => { byBrand[p.brand] = (byBrand[p.brand] || 0) + 1; });
    const topBrand = Object.entries(byBrand).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return { total, totalStoreProducts, percentage, avgPerStore, topBrand };
  };

  const kpis = calculateKPIs();
  const periodLabel = month === 0 ? "Todo el año" : `${MONTH_NAMES[month - 1]} ${year}`;

  const handleDownload = () => {
    const exportData = data?.store_products?.map(p => ({
      Código: p.code,
      Producto: p.product_name,
      Marca: p.brand,
      Stock: p.stock,
      Tienda: p.store_name,
    })) || [];
    exportToExcel(exportData, `Inventario a verificar ${periodLabel}`);
  };

  const chartData = useMemo(() => {
    if (!data?.store_products) return null;
    return {
      sales: data.store_products.map(p => ({
        store_name: p.store_name,
      })),
    };
  }, [data]);

  if (loading) {
    return (
      <Box>
        <Box className="card" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Verificación de Stock</Typography>
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
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Verificación de Stock</Typography>
          <Typography variant="body2" color="text.secondary">
            Sabemos que tus datos son críticos para tu negocio. Por eso en SmartVenta nos comprometemos a cuidar la integridad de tu inventario. Si detectamos duplicidades o inconsistencias, las identificamos y te ayudamos a resolverlas. Tu confianza es nuestro compromiso.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 350, gap: 2, opacity: 0.7 }}>
          <InboxIcon sx={{ fontSize: 64, color: "text.secondary" }} />
          <Typography variant="h6" color="text.secondary">Todo el stock está OK</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box className="card" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Verificación de Stock</Typography>
        <Typography variant="body2" color="text.secondary">
          Sabemos que tus datos son críticos para tu negocio. Por eso en SmartVenta nos comprometemos a cuidar la integridad de tu inventario. Si detectamos duplicidades o inconsistencias, las identificamos y te ayudamos a resolverlas. Tu confianza es nuestro compromiso.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Box className="card" sx={{ height: "100%", mb: 0, display: "flex", alignItems: "center", gap: 2 }}>
            <WarningIcon sx={{ fontSize: 32, color: "warning.main" }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Productos a verificar</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{kpis.total}</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box className="card" sx={{ height: "100%", mb: 0, display: "flex", alignItems: "center", gap: 2 }}>
            <InventoryIcon sx={{ fontSize: 32, color: "info.main" }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Total de productos</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{kpis.totalStoreProducts}</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box className="card" sx={{ height: "100%", mb: 0, display: "flex", alignItems: "center", gap: 2 }}>
            <StorefrontIcon sx={{ fontSize: 32, color: "primary.main" }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Cobertura</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{kpis.percentage}%</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box className="card" sx={{ height: "100%", mb: 0, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ fontSize: 32, color: "success.main" }}>📦</Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Promedio por tienda</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{kpis.avgPerStore}</Typography>
              {kpis.avgPerStore === '>1' && (
                <Typography variant="caption" color="text.secondary">menos de 1 producto por tienda</Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box className="card" sx={{ mb: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Productos a Verificar</Typography>
          <CustomButton onClick={handleDownload} disabled={!data?.store_products?.length} startIcon={<DownloadIcon />} size="small">
            Descargar
          </CustomButton>
        </Box>
        <DataTable
          progressPending={loading}
          noDataComponent="Sin productos a verificar"
          searcher={true}
          data={data?.store_products || []}
          columns={[
            { name: "Código", selector: (row) => <Chip label={row.code} size="small" variant="outlined" />, width: 120 },
            { name: "Producto", selector: (row) => row.product_name },
            { name: "Marca", selector: (row) => row.brand },
            { name: "Stock", selector: (row) => row.stock, width: 80 },
            { name: "Tienda", selector: (row) => row.store_name },
          ]}
        />
      </Box>

      <Grid container spacing={3} sx={{ mt: 0 }}>
        <Grid item xs={12} md={12}>
          <Box className="card" sx={{ height: "100%" }}>
            {chartData && <DoughnutChart 
              title="Productos a verificar por tienda" 
              data={chartData} 
              dataType="store" 
            />}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StockVerificationDashboard;
