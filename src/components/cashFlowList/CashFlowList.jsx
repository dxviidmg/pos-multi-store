import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Col, Form, Row } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { getFormattedDate, formatTimeFromDate } from "../utils/utils";
import { useDispatch } from "react-redux";

import { getCashFlow } from "../apis/cashflow";
import CashFlowModal from "../cashFlowModal/CashFlowModal";
import {
  hideCashFlowModal,
  showCashFlowModal,
} from "../redux/cashFlowModal/CashFlowModalActions";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";

const today = getFormattedDate();

const CashFlowList = () => {
  const [cashFlow, setCashFlow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(today);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCashData = async () => {
      setLoading(true);
      const cashFlow = await getCashFlow(date);
      setCashFlow(cashFlow.data);
      setLoading(false);
    };

    fetchCashData();
  }, [date]);

  const handleOpenModal = (cashFlow) => {
    dispatch(hideCashFlowModal());
    setTimeout(() => dispatch(showCashFlowModal(cashFlow)));
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
      <CustomSpinner2 isLoading={loading}></CustomSpinner2>
      <CashFlowModal onUpdateCashFlowList={handleUpdateCashFlowList} />
      <div className="custom-section">
        <h1>Movimientos en caja</h1>

        <Row>
          <Col className="d-flex flex-column justify-content-end">
            <CustomButton fullWidth={true} onClick={() => handleOpenModal()}>
              Crear movimiento
            </CustomButton>
          </Col>
          <Col>
            <Form>
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={today}
              />
            </Form>
          </Col>
        </Row>
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

export default CashFlowList;
