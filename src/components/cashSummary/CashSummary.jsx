import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Form } from "react-bootstrap";
import { getCashSummary } from "../apis/sales";
import CustomButton from "../commons/customButton/CustomButton";
import { getUserData } from "../apis/utils";
import {
  exportToExcel,
  getFormattedDate,
  formatTimeFromDate,
} from "../utils/utils";
import { getCashFlow } from "../apis/cashflow";
import CashFlowModal from "../cashFlowModal/CashFlowModal";
import { CustomSpinner } from "../commons/customSpinner/CustomSpinner";
import { Grid } from "@mui/material";

const CashSummary = () => {
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
      <CustomSpinner isLoading={loading}></CustomSpinner>
      <CashFlowModal onUpdateCashFlowList={handleUpdateCashFlowList} />
      <div className="custom-section">
        <h1>Corte de caja</h1>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Form>
              <Form.Group className="">
                <Form.Label className="">Fecha</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={today}
                />
              </Form.Group>
            </Form>
          </Grid>
          <Grid item xs={12} md={6} className="d-flex flex-column justify-content-end">
            <CustomButton onClick={handleExport} fullWidth>
              Descargar corte del dia
            </CustomButton>
          </Grid>

          <Grid item xs={12} md={4}>
            <h2>Métodos de pago</h2>
            <CustomTable
              data={paymentMethodsSummary}
              columns={[
                {
                  name: "Tipo",
                  selector: (row) => row.name,
                },
                {
                  name: "Cantidad",
                  style: {
                    justifyContent: "flex-end", // para alinear dentro del td con flexbox
                    textAlign: "right",
                  },
                  selector: (row) => "$" + row.amount,
                },
              ]}
            />
          </Grid>



          <Grid item xs={12} md={4}>
            <h2>Flujo de caja</h2>
            <CustomTable
              data={cashFlowSummary}
              columns={[
                {
                  name: "Tipo",
                  selector: (row) => row.name,
                },
                {
                  name: "Cantidad",
                  style: {
                    justifyContent: "flex-end", // para alinear dentro del td con flexbox
                    textAlign: "right",
                  },
                  selector: (row) => "$" + row.amount,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <h2> Total en caja</h2>
            <CustomTable
              data={totalSummary}
              columns={[
                {
                  name: "Tipo",
                  selector: (row) => row.name,
                },
                {
                  name: "Cantidad",
                  style: {
                    justifyContent: "flex-end", // para alinear dentro del td con flexbox
                    textAlign: "right",
                  },
                  selector: (row) => row.name === "Ventas canceladas" ? row.amount : "$" + row.amount,
                },
              ]}
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default CashSummary;
