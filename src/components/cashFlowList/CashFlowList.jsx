import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";

import CustomButton from "../commons/customButton/CustomButton";
import { getFormattedDate, formatTimeFromDate } from "../utils/utils";
import { useDispatch } from "react-redux";

import { getCashFlow } from "../apis/cashflow";
import CashFlowModal from "../cashFlowModal/CashFlowModal";
import {
  hideCashFlowModal,
  showCashFlowModal,
} from "../redux/cashFlowModal/CashFlowModalActions";
import { CustomSpinner } from "../commons/customSpinner/CustomSpinner";
import { Grid, TextField, Box } from "@mui/material";

const today = getFormattedDate();

const CashFlowList = () => {
  const [cashFlow, setCashFlow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({'start_date': today, 'end_date': today})

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCashData = async () => {
      setLoading(true);
      const cashFlow = await getCashFlow(params);
      setCashFlow(cashFlow.data);
      setLoading(false);
    };

    fetchCashData();
  }, [params]);

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


  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <CustomSpinner isLoading={loading}></CustomSpinner>
      <CashFlowModal onUpdateCashFlowList={handleUpdateCashFlowList} />
      <Grid container>
      <Grid item xs={12} className="custom-section">
        <h1>Movimientos en caja</h1>

        <Grid container spacing={2}>
          <Grid item xs={4} className="d-flex flex-column justify-content-end">
            <CustomButton fullWidth={true} onClick={() => handleOpenModal()}>
              Crear movimiento
            </CustomButton>
          </Grid>
          <Grid item xs={4}>
            <Box component="form">
              <TextField size="small" fullWidth label="Fecha de inicio" type="date"
                value={params.start_date}
                name="start_date"
                onChange={handleDataChange}
                max={today}
              />
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box component="form">
              <TextField size="small" fullWidth label="Fecha de fin" type="date"
                value={params.end_date}
                name="end_date"
                onChange={handleDataChange}
                max={today}
              />
            </Box>
          </Grid>

        </Grid>
        <CustomTable
          data={cashFlow}
          searcher={true}
          columns={[
            {
              name: "Creación",
              selector: (row) => formatTimeFromDate(row.created_at),
            },
            {
              name: "Concepto",
              selector: (row) => row.concept,
              wrap: true
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
      </Grid>
    </Grid>
  </>
  );
};

export default CashFlowList;
