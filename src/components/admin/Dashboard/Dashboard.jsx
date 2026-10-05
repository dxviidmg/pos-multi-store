import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getSalesDashboard } from "../../../api/sales";
import useTaskPolling from "../../../hooks/useTaskPolling";
import LineChart from "./LineChart";
import MainBarChart from "./MainBarChart";
import DoughnutChart from "./DoughnutChart";
import SalesHeatmap from "./SalesHeatmap";
import AvgTicketChart from "./AvgTicketChart";
import KPICard from "./KPICard";
import InsightCard from "./InsightCard";
import Filters from "./Filters";
import DashboardLoading from "./DashboardLoading";
import StoreComparisonTable from "./StoreComparisonTable";
import { getSalesInsights, getSalesKpis, getStoreComparison } from "./salesDashboardMetrics";
import EmptyState from "../../ui/EmptyState/EmptyState";
import { Grid, FormControl, Select, MenuItem, Box, Typography } from "@mui/material";
import { MONTH_NAMES, MONTH_NAMES_SHORT } from "../../../utils/date";
import { formatCurrency, formatNumber } from "../../../utils/currency";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PercentIcon from "@mui/icons-material/Percent";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const TITLE = "Tablero de ventas";

const METRIC_OPTIONS = [
  { value: "total", label: "Monto" },
  { value: "count", label: "Cantidad de transacciones" },
];

const Dashboard = () => {
  const [metricType, setMetricType] = useState("total");
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [mainChartType, setMainChartType] = useState("line");

  const startTask = useCallback(async () => {
    const response = await getSalesDashboard({ year, month });
    return response.data.task;
  }, [year, month]);

  const { data: dashboardData, loading, progress, countdown, fetchData } = useTaskPolling(startTask);

  useEffect(() => { fetchData(); }, [year, month, fetchData]);

  const kpis = useMemo(
    () => getSalesKpis(dashboardData, { metricType, year, month }),
    [dashboardData, metricType, year, month]
  );

  const storeComparison = useMemo(
    () => getStoreComparison(dashboardData, metricType),
    [dashboardData, metricType]
  );

  const insights = useMemo(
    () => getSalesInsights(dashboardData, { metricType, month }),
    [dashboardData, metricType, month]
  );

  const periodLabel = month === 0 ? `Todo el año ${year}` : `${MONTH_NAMES[month - 1]} ${year}`;

  const filters = (
    <Filters
      metricOptions={METRIC_OPTIONS}
      metricType={metricType}
      onMetricChange={setMetricType}
      year={year}
      onYearChange={setYear}
      month={month}
      onMonthChange={setMonth}
    />
  );

  if (loading) {
    return <DashboardLoading title={TITLE} progress={progress} countdown={countdown} chartCount={2} showPercent />;
  }

  if (!kpis) {
    return (
      <Box>
        <Box className="card">
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>{TITLE}</Typography>
          {filters}
        </Box>
        <EmptyState
          message="No hay ventas registradas en este periodo"
          description="Selecciona otro mes o año para ver datos"
        />
      </Box>
    );
  }

  const isYear = month === 0;
  const daysLabels = isYear
    ? []
    : Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => (i + 1).toString());
  const chartLabels = isYear ? MONTH_NAMES_SHORT : daysLabels;
  const chartDataType = isYear ? "monthly" : "day_of_month";

  const now = new Date();
  const todayLabel = !isYear && year === now.getFullYear() && month === now.getMonth() + 1
    ? now.getDate().toString() : null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box className="card" sx={{ mb: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{TITLE}</Typography>
            <Typography variant="body2" color="text.secondary">{periodLabel}</Typography>
          </Box>
        </Box>
        {filters}
      </Box>

      {metricType === "total" && (
        <Grid container spacing={2}>
          <KPICard
            title="Ventas"
            value={formatCurrency(kpis.totalAmount)}
            subtitle={`${kpis.totalSales} transacciones`}
            icon={AttachMoneyIcon}
            index={0}
          />
          <KPICard
            title="Ganancias"
            value={formatCurrency(kpis.totalProfit)}
            subtitle={periodLabel}
            icon={TrendingUpIcon}
            index={1}
          />
          <KPICard
            title="Margen"
            value={`${kpis.marginPercentage}%`}
            subtitle={`De ${formatCurrency(kpis.totalAmount)}`}
            icon={PercentIcon}
            index={2}
          />
          <KPICard
            title="Ticket promedio"
            value={formatCurrency(kpis.totalAmount / kpis.totalSales)}
            subtitle={`${kpis.totalSales} ventas`}
            icon={ShoppingCartIcon}
            index={3}
          />
        </Grid>
      )}

      {metricType === "count" && (
        <Grid container spacing={2}>
          <KPICard
            title="Transacciones"
            value={formatNumber(kpis.totalSales)}
            subtitle={periodLabel}
            icon={ShoppingCartIcon}
            index={0}
          />
          <KPICard
            title={isYear ? "Promedio por mes" : "Promedio por día"}
            value={(kpis.totalSales / (isYear ? 12 : kpis.daysInPeriod)).toFixed(0)}
            subtitle={isYear ? "12 meses" : `${kpis.daysInPeriod} días`}
            icon={StorefrontIcon}
            index={1}
          />
        </Grid>
      )}

      {insights && storeComparison.length > 1 && (
        <Grid container spacing={2}>
          <InsightCard icon={StorefrontIcon} title="Tiendas" best={insights.bestStore} worst={insights.worstStore} />
          {!isYear && (
            <InsightCard icon={CalendarMonthIcon} title="Día del mes" best={`Día ${insights.bestDay}`} worst={`Día ${insights.worstDay}`} />
          )}
          {!isYear && (
            <InsightCard icon={CalendarMonthIcon} title="Día de la semana" best={insights.bestDayOfWeek} worst={insights.worstDayOfWeek} />
          )}
          <InsightCard icon={AccessTimeIcon} title="Horas" best={insights.bestHour} worst={insights.worstHour} />
        </Grid>
      )}

      {storeComparison.length > 1 && (
        <StoreComparisonTable
          stores={storeComparison}
          metricType={metricType}
          month={month}
          daysInPeriod={kpis.daysInPeriod}
        />
      )}

      <Box className="card">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, color: "text.primary" }}>
            {isYear ? "Ventas por mes" : "Ventas por día del mes"}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={mainChartType} onChange={(e) => setMainChartType(e.target.value)}>
              <MenuItem value="line">Líneas</MenuItem>
              <MenuItem value="bar">Barras</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {mainChartType === "line" ? (
          <LineChart
            title=""
            data={dashboardData}
            metricType={metricType}
            labels={chartLabels}
            xText={isYear ? "Meses" : "Días"}
            dataType={chartDataType}
            todayLabel={todayLabel}
          />
        ) : (
          <MainBarChart
            data={dashboardData}
            metricType={metricType}
            labels={chartLabels}
            dataType={chartDataType}
            daysInMonth={isYear ? 12 : daysLabels.length}
            todayLabel={todayLabel}
          />
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box className="card" sx={{ height: "100%" }}>
            <AvgTicketChart data={dashboardData} metricType={metricType} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box className="card" sx={{ height: "100%" }}>
            <DoughnutChart
              title="Ventas por tienda"
              data={dashboardData}
              metricType={metricType}
              dataType="store"
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box className="card">
            <SalesHeatmap data={dashboardData} metricType={metricType} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
