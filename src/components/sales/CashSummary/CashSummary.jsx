import React, { useEffect, useState } from "react";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";

import { getCashSummary } from "../../../api/sales";
import CustomButton from "../../ui/Button/Button";
import { getUserData } from "../../../api/utils";
import {
  exportToExcel,
  getFormattedDate,
  formatTimeFromDate,
} from "../../../utils/utils";
import { getCashFlow } from "../../../api/cashflow";
import CashFlowModal from "../../finance/CashFlowModal/CashFlowModal";
import { useModal } from "../../../hooks/useModal";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { Grid, TextField, Box, Typography, Stack } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";

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

  useEffect(() => {
    const fetchCashData = async () => {
      setLoading(true);
      const cashSummary = await getCashSummary(date);
      const paymentMethods = cashSummary.data.filter(
        (cash) => cash.payment_method_data === true
      );
      const cashFlowSummary = cashSummary.data.filter(
        (cash) => cash.cashflow_data === true
      );
      const totalSummary = cashSummary.data.filter(
        (cash) => cash.total_data === true
      );
      setPaymentMethodsSummary(paymentMethods);
      setCashSummary(cashSummary.data);
      setCashFlowSummary(cashFlowSummary);
      setTotalSummary(totalSummary);
      const cashFlow = await getCashFlow({start_date: date, end_date: date});
      setCashFlow(cashFlow.data);
      setLoading(false);
    };

    fetchCashData();
  }, [date]);

  useEffect(() => {
    const fetchCashData = async () => {
      const cashSummary = await getCashSummary(date);
      const paymentMethods = cashSummary.data.filter(
        (cash) => cash.payment_method_data === true
      );
      const cashFlowSummary = cashSummary.data.filter(
        (cash) => cash.cashflow_data === true
      );
      const totalSummary = cashSummary.data.filter(
        (cash) => cash.total_data === true
      );
      setPaymentMethodsSummary(paymentMethods);
      setCashSummary(cashSummary.data);
      setCashFlowSummary(cashFlowSummary);
      setTotalSummary(totalSummary);
    };

    fetchCashData();
  }, [date, cashFlow]);

  const handleExport = () => {
    // Definir valores iniciales
    const isPartial = date === today;
    const dateFile = `${date}${isPartial ? " " + formatTimeFromDate() : ""}`;
    const type = isPartial ? "parcial " : "total ";

    // Generar el prefijo del nombre del archivo
    const prefixName = `Corte de caja ${type}${
      getUserData().store_name
    } ${dateFile}`;

    // Exportar a Excel
    exportToExcel(cashSummary, prefixName, false);
  };

  const handleUpdateCashFlowList = (updateCashFlow) => {
    setCashFlow((prevBrands) => {
      const brandExists = prevBrands.some((b) => b.id === updateCashFlow.id);
      return brandExists
        ? prevBrands.map((b) =>
            b.id === updateCashFlow.id ? updateCashFlow : b
          )
        : [...prevBrands, updateCashFlow];
    });
  };

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
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1">Corte de caja</Typography>
          <CustomButton onClick={handleExport} startIcon={<DownloadIcon />}>
            Descargar corte
          </CustomButton>
        </Stack>

        {/* Selector de fecha */}
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

        {/* Tarjetas de resumen */}
        <Grid container spacing={3}>
          {/* Métodos de pago */}
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <PaymentIcon color="primary" />
              <Typography variant="h6">Métodos de pago</Typography>
            </Stack>
            <SimpleTable
              data={paymentMethodsSummary}
              columns={[
                {
                  name: "Tipo",
                  selector: (row) => row.name,
                  grow: 1.5,
                },
                {
                  name: "Cantidad",
                  selector: (row) => "$" + row.amount,
                  grow: 1,
                },
              ]}
            />
          </Grid>

          {/* Flujo de caja */}
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <AccountBalanceWalletIcon color="primary" />
              <Typography variant="h6">Flujo de caja</Typography>
            </Stack>
            <SimpleTable
              data={cashFlowSummary}
              columns={[
                {
                  name: "Tipo",
                  selector: (row) => row.name,
                  grow: 1.5,
                },
                {
                  name: "Cantidad",
                  selector: (row) => "$" + row.amount,
                  grow: 1,
                },
              ]}
            />
          </Grid>

          {/* Total en caja */}
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <PointOfSaleIcon color="primary" />
              <Typography variant="h6">Total en caja</Typography>
            </Stack>
            <SimpleTable
              data={totalSummary}
              columns={[
                {
                  name: "Tipo",
                  selector: (row) => row.name,
                  grow: 1.5,
                },
                {
                  name: "Cantidad",
                  selector: (row) => row.name === "Ventas canceladas" ? row.amount : "$" + row.amount,
                  grow: 1,
                },
              ]}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CashSummary;
