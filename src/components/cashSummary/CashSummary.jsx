import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Col, Form, Row } from "react-bootstrap";
import { getCashSummary } from "../apis/sales";
import CustomButton from "../commons/customButton/CustomButton";
import { getUserData } from "../apis/utils";
import {
  exportToExcel,
  getFormattedDate,
  formatTimeFromDate,
} from "../utils/utils";
import { useDispatch } from "react-redux";


import { getCashFlow } from "../apis/cashflow";
import CashFlowModal from "../cashFlowModal/CashFlowModal";
import { hideCashFlowModal, showCashFlowModal } from "../redux/cashFlowModal/CashFlowModalActions";

const CashSummary = () => {
  const [cashSummary, setCashSummary] = useState([]);
  const [paymentMethodsSummary, setPaymentMethodsSummary] = useState([]);
  const [salesSummary, setSalesSummary] = useState([]);
  const today = getFormattedDate();
  const [date, setDate] = useState(today);
  const [cashFlow, setCashFlow] = useState([]);
  const [cashFlowSummary, setCashFlowSummary] = useState([]);
  const [totalSummary, setTotalSummary] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCashData = async () => {
      const cashSummary = await getCashSummary(date);
      const paymentMethods = cashSummary.data.filter(
        (cash) => cash.payment_method_data === true
      );
      const salesSummary = cashSummary.data.filter(
        (cash) => cash.sales_data === true
      );
      const cashFlowSummary = cashSummary.data.filter(
        (cash) => cash.cashflow_data === true
      );
      const totalSummary = cashSummary.data.filter(
        (cash) => cash.total_data === true
      );
      setSalesSummary(salesSummary);
      setPaymentMethodsSummary(paymentMethods);
      setCashSummary(cashSummary.data);
      setCashFlowSummary(cashFlowSummary);
      setTotalSummary(totalSummary);
      const cashFlow = await getCashFlow(date);
      setCashFlow(cashFlow.data);
    };

    fetchCashData();
  }, [date]);

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

  const handleOpenModal = (cashFlow) => {
    console.log('hola')
    dispatch(hideCashFlowModal());
    setTimeout(() => dispatch(showCashFlowModal(cashFlow)));
  };

  const handleUpdateCashFlowList = (updateCashFlow) => {
      setCashFlow((prevBrands) => {
        const brandExists = prevBrands.some((b) => b.id === updateCashFlow.id);
        return brandExists
          ? prevBrands.map((b) => (b.id === updateCashFlow.id ? updateCashFlow : b))
          : [...prevBrands, updateCashFlow];
      });
    };



  return (
    <>
      <CashFlowModal onUpdateCashFlowList={handleUpdateCashFlowList}/>
      <div className="custom-section">
        <Row>
          <Col md={6}>
            <Form.Label className="fw-bold">Resumen de caja</Form.Label>

            <Form>
            <Form.Group className="d-flex align-items-center">
              <Form.Label className="mr-5">Fecha</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={today}
              />
              </Form.Group>
            </Form>
          </Col>
          <Col md={6} className="d-flex flex-column justify-content-end">
            <CustomButton onClick={handleExport} fullWidth>
              Descargar corte del dia
            </CustomButton>
          </Col>

          <Col md={3}>
            <Form.Label className="fw-bold">Metodos de pago</Form.Label>
            <CustomTable
              data={paymentMethodsSummary}
              columns={[
                {
                  name: "Tipo",
                  selector: (row) => row.name,
                },
                {
                  name: "Cantidad",
                  selector: (row) => "$" + row.amount,
                },
              ]}
            />
          </Col>



          <Col md={3}>
            <Form.Label className="fw-bold">
              Revisión de ventas y pagos
            </Form.Label>
            <CustomTable
              data={salesSummary}
              columns={[
                {
                  name: "Tipo",
                  selector: (row) => row.name,
                },
                {
                  name: "Cantidad",
                  selector: (row) => "$" + row.amount,
                },
              ]}
            />
          </Col>


          <Col md={3}>
            <Form.Label className="fw-bold"> Entradas y salidas</Form.Label>
            <CustomTable
              data={cashFlowSummary}
              columns={[
                {
                  name: "Tipo",
                  selector: (row) => row.name,
                },
                {
                  name: "Cantidad",
                  selector: (row) => "$" + row.amount,
                },
              ]}
            />
          </Col>


          <Col md={3}>
            <Form.Label className="fw-bold"> Total en caja</Form.Label>
            <CustomTable
              data={totalSummary}
              columns={[
                {
                  name: "Tipo",
                  selector: (row) => row.name,
                },
                {
                  name: "Cantidad",
                  selector: (row) => "$" + row.amount,
                },
              ]}
            />
          </Col>
        </Row>
      </div>

      <div className="custom-section">
        <Form.Label className="fw-bold">Lista de movimientos</Form.Label>
        <br/>
        <CustomButton onClick={()=> handleOpenModal()}>Crear movimiento</CustomButton>
        <CustomTable
          data={cashFlow}
          columns={[
            {
              name: "Creación",
              selector: (row) => formatTimeFromDate(row.created_at),
            },
            {
              name: "Concepto",
              selector: (row) => row.concept,
            },

            {
              name: "Tipo",
              selector: (row) => row.transaction_type_display,
            },

            {
              name: "Cantidad",
              selector: (row) => "$" + row.amount,
            },
            {
              name: "usuario",
              selector: (row) => row.user_username,
            },
          ]}
        />
      </div>
    </>
  );
};

export default CashSummary;
