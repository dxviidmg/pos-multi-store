import React, { useEffect, useState, useCallback } from "react";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import CustomButton from "../../ui/Button/Button";
import { getUserData } from "../../../api/utils";
import { exportToExcel, getFormattedDate, formatTimeFromDate } from "../../../utils/utils";
import { getCashSummary } from "../../../api/sales";
import { getCashFlow } from "../../../api/cashflow";
import CashFlowModal from "../../finance/CashFlowModal/CashFlowModal";
import { useModal } from "../../../hooks/useModal";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { Grid, TextField, Box, Typography, Stack, Chip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";

const summaryColumns = [
  { name: "Tipo", selector: (row) => row.name },
  { name: "Cantidad", selector: (row) => "$" + row.amount },
];

const CashSummary = () => {
  const cashFlowModal = useModal();
  const [cashSummary, setCashSummary] = useState([]);
  const [paymentMethodsSummary, setPaymentMethodsSummary] = useState([]);
  const today = getFormattedDate();
  const [date, setDate] = useState(today);
  const [cashFlow, setCashFlow] = useState([]);
  const [cashFlowSummary, setCashFlowSummary] = useState([]);
  const [totalSummary, setTotalSummary] = useState([]);
  const [loading, setLoading] = useState(false);

  const isPartial = date === today;

  const processSummary = (data) => {
    setPaymentMethodsSummary(data.filter((c) => c.payment_method_data));
    setCashFlowSummary(data.filter((c) => c.cashflow_data));
    setTotalSummary(data.filter((c) => c.total_data));
    setCashSummary(data);
  };

  const fetchSummary = useCallback(async () => {
    const res = await getCashSummary(date);
    processSummary(res.data);
  }, [date]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [summaryRes, cashFlowRes] = await Promise.all([
        getCashSummary(date),
        getCashFlow({ start_date: date, end_date: date }),
      ]);
      processSummary(summaryRes.data);
      setCashFlow(cashFlowRes.data);
      setLoading(false);
    };
    fetchData();
  }, [date]);

  useEffect(() => {
    fetchSummary();
  }, [cashFlow, fetchSummary]);

  const handleExport = () => {
    const dateFile = `${date}${isPartial ? " " + formatTimeFromDate() : ""}`;
    const type = isPartial ? "parcial " : "total ";
    exportToExcel(cashSummary, `Corte de caja ${type}${getUserData().store_name} ${dateFile}`, false);
  };

  const handleUpdateCashFlowList = (updated) => {
    setCashFlow((prev) => {
      const exists = prev.some((item) => item.id === updated.id);
      return exists
        ? prev.map((item) => (item.id === updated.id ? updated : item))
        : [...prev, updated];
    });
  };

  const totalColumns = [
    { name: "Tipo", selector: (row) => row.name },
    {
      name: "Cantidad",
      selector: (row) => row.name === "Ventas canceladas" ? row.amount : "$" + row.amount,
    },
  ];

  return (
    <>
      <CustomSpinner isLoading={loading} />
      <CashFlowModal
        isOpen={cashFlowModal.isOpen}
        cashFlow={cashFlowModal.data}
        onClose={cashFlowModal.close}
        onUpdate={handleUpdateCashFlowList}
      />

      <Grid item xs={12} className="card">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h4" component="h1">Corte de caja</Typography>
            <Chip
              label={isPartial ? "Parcial" : "Total"}
              color={isPartial ? "warning" : "success"}
              size="small"
            />
          </Stack>
          <CustomButton onClick={handleExport} startIcon={<DownloadIcon />}>
            Descargar corte
          </CustomButton>
        </Stack>

        <Box sx={{ mb: 3, maxWidth: 300 }}>
          <TextField
            size="small"
            fullWidth
            type="date"
            label="Fecha"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            inputProps={{ max: today }}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <PaymentIcon color="primary" />
              <Typography variant="h6">Métodos de pago</Typography>
            </Stack>
            <SimpleTable noDataComponent="Sin datos" data={paymentMethodsSummary} columns={summaryColumns} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <AccountBalanceWalletIcon color="primary" />
              <Typography variant="h6">Flujo de caja</Typography>
            </Stack>
            <SimpleTable noDataComponent="Sin datos" data={cashFlowSummary} columns={summaryColumns} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <PointOfSaleIcon color="primary" />
              <Typography variant="h6">Total en caja</Typography>
            </Stack>
            <SimpleTable noDataComponent="Sin datos" data={totalSummary} columns={totalColumns} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CashSummary;
