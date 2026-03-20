import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import { getFormattedDate, formatTimeFromDate } from "../../../utils/utils";
import { getCashFlow } from "../../../api/cashflow";
import CashFlowModal from "../CashFlowModal/CashFlowModal";
import { useModal } from "../../../hooks/useModal";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { Grid, TextField, Stack } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const today = getFormattedDate();

const CashFlowList = () => {
  const [cashFlow, setCashFlow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ start_date: today, end_date: today });
  const cashFlowModal = useModal();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getCashFlow(params);
      setCashFlow(res.data);
      setLoading(false);
    };
    fetchData();
  }, [params]);

  const handleUpdateCashFlowList = (updated) => {
    setCashFlow((prev) => {
      const exists = prev.some((item) => item.id === updated.id);
      return exists
        ? prev.map((item) => (item.id === updated.id ? updated : item))
        : [...prev, updated];
    });
  };

  const handleParamsChange = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
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
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <h1>Movimientos en caja</h1>
          <CustomButton
            onClick={() => cashFlowModal.open()}
            startIcon={<AddCircleIcon />}
          >
            Crear movimiento
          </CustomButton>
        </Stack>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              size="small"
              fullWidth
              label="Fecha de inicio"
              type="date"
              value={params.start_date}
              name="start_date"
              onChange={handleParamsChange}
              inputProps={{ max: today }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              size="small"
              fullWidth
              label="Fecha de fin"
              type="date"
              value={params.end_date}
              name="end_date"
              onChange={handleParamsChange}
              inputProps={{ max: today }}
            />
          </Grid>
        </Grid>

        <DataTable
          data={cashFlow}
          searcher={true}
          columns={[
            {
              name: "Creación",
              selector: (row) => formatTimeFromDate(row.created_at),
            },
            { name: "Concepto", selector: (row) => row.concept },
            { name: "Tipo", selector: (row) => row.transaction_type_display },
            { name: "Cantidad", selector: (row) => "$" + row.amount },
            { name: "Usuario", selector: (row) => row.user_username },
          ]}
        />
      </Grid>
    </>
  );
};

export default CashFlowList;
