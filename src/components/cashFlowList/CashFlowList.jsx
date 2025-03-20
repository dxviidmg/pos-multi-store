import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Form } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import {
  getFormattedDate,
  formatTimeFromDate,
} from "../utils/utils";
import { useDispatch } from "react-redux";


import { getCashFlow } from "../apis/cashflow";
import CashFlowModal from "../cashFlowModal/CashFlowModal";
import { hideCashFlowModal, showCashFlowModal } from "../redux/cashFlowModal/CashFlowModalActions";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";

const CashFlowList = () => {
  const [cashFlow, setCashFlow] = useState([]);
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCashData = async () => {
      setLoading(true)
      const today = getFormattedDate();
      const cashFlow = await getCashFlow(today);
      setCashFlow(cashFlow.data);
      setLoading(false)
    };

    fetchCashData();
  }, []);



  const handleOpenModal = (cashFlow) => {
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
    <CustomSpinner2 isLoading={loading}></CustomSpinner2>
      <CashFlowModal onUpdateCashFlowList={handleUpdateCashFlowList}/>
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

export default CashFlowList;
