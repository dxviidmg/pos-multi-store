import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import { getFormattedDate, formatTimeFromDate, formatCurrency, upsertById } from "../../../utils/utils";
import { getCashFlow, deleteCashFlow } from "../../../api/cashflow";
import { useUser } from "../../../context/UserContext";
import CashFlowModal from "../CashFlowModal/CashFlowModal";
import { useModal } from "../../../hooks/useModal";
import { isOwner, isSeller as isSellerUser } from "../../../constants/routeAccess";
import DateRangeFilter from "../../ui/DateRangeFilter/DateRangeFilter";
import { Grid } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PageHeader from "../../ui/PageHeader";
import { showSuccess, showConfirm, showRequestError } from "../../../utils/alerts";

const CashFlowList = () => {
  const [cashFlow, setCashFlow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState(() => {
    const today = getFormattedDate();
    return { start_date: today, end_date: today };
  });
  const cashFlowModal = useModal();
  const { user } = useUser();
  const isSeller = isSellerUser(user);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getCashFlow(params);
        if (!ignore) setCashFlow(res.data);
      } catch (error) {
        if (!ignore) showRequestError("cargar los movimientos", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchData();
    return () => {
      ignore = true;
    };
  }, [params]);

  // Crear devuelve el movimiento completo; editar (PATCH) solo los campos enviados, así que se recarga la lista.
  const handleUpdateCashFlowList = (updated, isEdit) => {
    if (isEdit) setParams((prev) => ({ ...prev }));
    else setCashFlow((prev) => upsertById(prev, updated));
  };

  const handleDelete = async (row) => {
    const confirmed = await showConfirm(
      "¿Eliminar movimiento?",
      `Se eliminará "${row.concept}" por ${formatCurrency(row.amount)}`
    );
    if (!confirmed) return;

    try {
      await deleteCashFlow(row.id);
      setCashFlow((prev) => prev.filter((item) => item.id !== row.id));
      showSuccess("Movimiento eliminado");
    } catch (error) {
      showRequestError("eliminar el movimiento", error);
    }
  };

  const handleParamsChange = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
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
          <DateRangeFilter
            startDate={params.start_date}
            endDate={params.end_date}
            onChange={handleParamsChange}
            disabled={isSeller}
          />
        </Grid>

        <DataTable
          progressPending={loading}
          noDataComponent="Sin movimientos"
          data={cashFlow}
          searcher
          columns={[
            {
              name: "Hora",
              selector: (row) => formatTimeFromDate(row.created_at),
            },
            { name: "Concepto", selector: (row) => row.concept },
            { name: "Tipo", selector: (row) => row.transaction_type_display },
            { name: "Cantidad", selector: (row) => formatCurrency(row.amount) },
            { name: "Usuario", selector: (row) => row.user_username },
            ...(isOwner(user) ? [{
              name: "Acciones",
              cell: (row) => (
                <>
                  <CustomTooltip text="Editar movimiento">
                    <CustomButton onClick={() => cashFlowModal.open(row)}>
                      <EditIcon />
                    </CustomButton>
                  </CustomTooltip>
                  <CustomTooltip text="Eliminar movimiento">
                    <CustomButton onClick={() => handleDelete(row)}>
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
