import React, { useEffect, useState } from "react";
import { getTaskResult } from "../../../api/products";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import {
  Grid, FormControl, InputLabel, Select, MenuItem, Box, Typography,
  LinearProgress, Skeleton,
} from "@mui/material";
import { showError } from "../../../utils/alerts";
import { MONTH_NAMES, getErrorMessage } from "../../../utils/utils";
import httpClient from "../../../api/httpClient";
import { getApiUrl, getHeaders, buildUrlWithParams } from "../../../api/utils";
import InboxIcon from "@mui/icons-material/Inbox";

const ProductsDashboard = () => {
  const [data, setData] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    setProgress(0);
    try {
      const url = buildUrlWithParams(getApiUrl("products-dashboard"), { year, month });
      const response = await httpClient.get(url, { headers: getHeaders() });
      const taskId = response.data.task;
      const pollTask = async () => {
        try {
          const { data: taskData } = await getTaskResult(taskId);
          if (taskData.meta?.current && taskData.meta?.total) setProgress((taskData.meta.current / taskData.meta.total) * 100);
          if (taskData.status === "SUCCESS") {
            setData(taskData.result);
            setLoading(false);
            setProgress(100);
            clearInterval(intervalId);
          } else if (taskData.status === "FAILURE") {
            showError("Error", taskData.error?.message || "Error desconocido");
            setLoading(false);
            clearInterval(intervalId);
          }
        } catch (error) {
          showError("Error", getErrorMessage(error));
          setLoading(false);
          clearInterval(intervalId);
        }
      };
      let intervalId;
      pollTask();
      intervalId = setInterval(pollTask, 10000);
    } catch (error) {
      showError("Error al cargar el tablero", getErrorMessage(error));
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [year, month]);

  const periodLabel = month === 0 ? "Todo el año" : `${MONTH_NAMES[month - 1]} ${year}`;

  if (loading) {
    return (
      <Box>
        <Box className="card" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Marcas y productos</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Procesando datos...</Typography>
          <LinearProgress variant={progress > 0 ? "determinate" : "indeterminate"} value={progress} sx={{ height: 6, borderRadius: 3, mb: 1 }} />
        </Box>
        <Grid container spacing={2}>
          {[0,1,2].map(i => (
            <Grid item xs={12} md={4} key={i}>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: "14px" }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box>
        <Box className="card">
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Marcas y productos</Typography>
          <Filters {...{ year, setYear, month, setMonth }} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 350, gap: 2, opacity: 0.7 }}>
          <InboxIcon sx={{ fontSize: 64, color: "text.secondary" }} />
          <Typography variant="h6" color="text.secondary">No hay datos en este periodo</Typography>
        </Box>
      </Box>
    );
  }

  const { top_products, top_brands, worst_products } = data;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box className="card" sx={{ mb: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Marcas y productos</Typography>
            <Typography variant="body2" color="text.secondary">{periodLabel}</Typography>
          </Box>
        </Box>
        <Filters {...{ year, setYear, month, setMonth }} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box className="card" sx={{ height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>Marcas más vendidas</Typography>
            <SimpleTable
              data={top_brands}
              columns={[
                { name: "Marca", selector: (row) => row.name },
                { name: "Productos", selector: (row) => row.product_count },
                { name: "% de ventas", selector: (row) => `${row.percentage}%` },
              ]}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box className="card" sx={{ height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>Productos más vendidos</Typography>
            <SimpleTable
              data={top_products}
              columns={[
                { name: "Código", selector: (row) => row.code },
                { name: "Nombre", selector: (row) => row.name },
                { name: "Marca", selector: (row) => row.brand_name },
                { name: "% de ventas", selector: (row) => `${row.percentage}%` },
              ]}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box className="card">
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>Productos menos vendidos</Typography>
            <SimpleTable
              data={worst_products}
              columns={[
                { name: "Código", selector: (row) => row.code },
                { name: "Nombre", selector: (row) => row.name },
                { name: "Marca", selector: (row) => row.brand_name },
                { name: "% de ventas", selector: (row) => `${row.percentage}%` },
              ]}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const Filters = ({ year, setYear, month, setMonth }) => (
  <Grid container spacing={2} alignItems="center">
    <Grid item xs={12} sm={6}>
      <FormControl size="small" fullWidth>
        <InputLabel>Año</InputLabel>
        <Select value={year} label="Año" onChange={(e) => setYear(e.target.value)}>
          {Array.from({ length: new Date().getFullYear() - 2024 }, (_, i) => 2025 + i).map(y => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} sm={6}>
      <FormControl size="small" fullWidth>
        <InputLabel>Mes</InputLabel>
        <Select value={month} label="Mes" onChange={(e) => setMonth(e.target.value)}>
          <MenuItem value={0}>Todo el año</MenuItem>
          {MONTH_NAMES.map((m, i) => (
            <MenuItem key={i + 1} value={i + 1}>{m}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  </Grid>
);

export default ProductsDashboard;
