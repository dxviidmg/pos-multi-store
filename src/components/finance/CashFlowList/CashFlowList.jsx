import React, { useEffect, useState } from "react";
import CustomTable from "../../ui/Table/Table";
import CustomButton from "../../ui/Button/Button";
import { getFormattedDate, formatTimeFromDate } from "../../../utils/utils";
import { getCashFlow } from "../../../api/cashflow";
import CashFlowModal from "../CashFlowModal/CashFlowModal";
import { useModal } from "../../../hooks/useModal";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { Grid, TextField } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const today = getFormattedDate();

const CashFlowList = () => {
  const [cashFlow, setCashFlow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({'start_date': today, 'end_date': today})

  const cashFlowModal = useModal();

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
    cashFlowModal.open(cashFlow);
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
      {/* 1. SPINNERS */}
      <CustomSpinner isLoading={loading} />
      
      {/* 2. MODALS */}
      <CashFlowModal isOpen={cashFlowModal.isOpen} cashFlow={cashFlowModal.data} onClose={cashFlowModal.close} onUpdate={handleUpdateCashFlowList} />
      
      {/* 3. CONTENIDO PRINCIPAL */}
      <Grid container>
        <Grid item xs={12} className="card">
          {/* 3.1 Header */}
          <h1>Movimientos en caja</h1>

          {/* 3.2 Filtros */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <CustomButton
                fullWidth
                onClick={() => handleOpenModal()}
                startIcon={<AddCircleIcon />}
              >
                Crear movimiento
              </CustomButton>
            </Grid>
            <Grid item xs={4}>
              <TextField
                size="small"
                fullWidth
                label="Fecha de inicio"
                type="date"
                value={params.start_date}
                name="start_date"
                onChange={handleDataChange}
                max={today}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                size="small"
                fullWidth
                label="Fecha de fin"
                type="date"
                value={params.end_date}
                name="end_date"
                onChange={handleDataChange}
                max={today}
              />
            </Grid>
          </Grid>

          {/* 3.3 Tabla */}
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
                wrapText: true,
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
