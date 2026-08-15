import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import { getFormattedDate, formatTimeFromDate } from "../../../utils/utils";
import { getCashFlow, deleteCashFlow } from "../../../api/cashflow";
import { useUser } from "../../../context/UserContext";
import CashFlowModal from "../CashFlowModal/CashFlowModal";
import { useModal } from "../../../hooks/useModal";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { Grid, TextField } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PageHeader from "../../ui/PageHeader";
import { showSuccess, showError, showConfirm } from "../../../utils/alerts";

const today = getFormattedDate();

const CashFlowList = () => {
  const [cashFlow, setCashFlow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ start_date: today, end_date: today });
  const cashFlowModal = useModal();
  const { user } = useUser();
  const isSeller = user?.role === "seller";

  const fetchData = async () => {
    setLoading(true);
    const res = await getCashFlow(params);
    setCashFlow(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleUpdateCashFlowList = (updated, isEdit) => {
    if (isEdit) {
      fetchData();
    } else {
      setCashFlow((prev) => [...prev, updated]);
    }
  };

  const handleDelete = async (row) => {
    const confirmed = await showConfirm(
      "¿Eliminar movimiento?",
      `Se eliminará "${row.concept}" por $${row.amount}`
    );
    if (!confirmed) return;

    const response = await deleteCashFlow(row.id);
    if (response.status === 200 || response.status === 204) {
      setCashFlow((prev) => prev.filter((item) => item.id !== row.id));
      showSuccess("Movimiento eliminado");
    } else {
      showError("Error al eliminar", "No se pudo eliminar el movimiento");
    }
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
        <PageHeader title="Movimientos en caja">
          <CustomButton
            fullWidth
            onClick={() => cashFlowModal.open()}
            startIcon={<AddCircleIcon />}
          >
            Crear movimiento
          </CustomButton>
        </PageHeader>

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
              disabled={isSeller}
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
              disabled={isSeller}
            />
          </Grid>
        </Grid>

        <DataTable
          progressPending={loading}
          noDataComponent="Sin movimientos"
          data={cashFlow}
          searcher={true}
          columns={[
            {
              name: "Hora",
              selector: (row) => formatTimeFromDate(row.created_at),
            },
            { name: "Concepto", selector: (row) => row.concept },
            { name: "Tipo", selector: (row) => row.transaction_type_display },
            { name: "Cantidad", selector: (row) => "$" + row.amount },
            { name: "Usuario", selector: (row) => row.user_username },
            ...(user?.role === "owner" ? [{
              name: "Acciones",
              cell: (row) => (
                <>
                  <CustomTooltip text="Editar movimiento">
                    <CustomButton size="small" onClick={() => cashFlowModal.open(row)}>
                      <EditIcon />
                    </CustomButton>
                  </CustomTooltip>
                  <CustomTooltip text="Eliminar movimiento">
                    <CustomButton size="small" onClick={() => handleDelete(row)}>
                      <DeleteIcon />
                    </CustomButton>
                  </CustomTooltip>
                </>
              ),
            }] : []),
          ]}
        />
      </Grid>
    </>
  );
};

export default CashFlowList;
