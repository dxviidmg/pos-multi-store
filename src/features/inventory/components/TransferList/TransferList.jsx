import React, { useState, useEffect } from "react";
import DataTable from "@/src/shared/ui/DataTable/DataTable";
import { calculateTimeAgo, formatTimeFromDate } from "@/src/shared/utils/utils";
import CustomButton from "@/src/shared/ui/Button/Button";
import { showSuccess, showError } from "@/src/shared/utils/alerts";
import { CustomSpinner } from "@/src/shared/ui/Spinner/Spinner";
import { useTransfers, useDeleteTransfer } from "@/src/features/inventory/hooks/useTransfers";
import { Grid, MenuItem, FormControl, InputLabel, Select, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PageHeader from "@/src/shared/ui/PageHeader";



const TransferList = () => {
  const [status, setStatus] = useState("pending");
  const params = { status };
  const { data: transfers = [], isLoading, refetch } = useTransfers(params);
  const deleteTransferMutation = useDeleteTransfer();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDelete = async (transfer) => {
    try {
      await deleteTransferMutation.mutateAsync(transfer.id);
      showSuccess("Transferencia eliminada");
    } catch (error) {
      showError("Error al eliminar transferencia");
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const statusOptions = [
    { value: "pending", label: "Pendientes" },
    { value: "applied", label: "Aplicados" },
  ];

  const filterDescription = status === "applied" 
    ? "Solo traspasos de hoy" 
    : "Sin filtro de fecha";

  return (
    <>
      <CustomSpinner isLoading={isLoading} />

      <Grid item xs={12} className="card">
        <PageHeader title="Traspasos" />
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select value={status} onChange={handleStatusChange} label="Estado">
                {statusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Filtro de fecha"
              name="name"
              value={filterDescription}
              size="small"
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>

        </Grid>

        <DataTable
          progressPending={isLoading}
          noDataComponent={`Sin traspasos ${status === "pending" ? 'pendientes (todos los tiempos)' : 'aplicados (solo hoy)'}`}
          data={transfers}
          columns={[
            { name: "#", selector: (row) => row.id },
            { name: "Código", selector: (row) => row.product_code },
            { name: "Nombre", selector: (row) => row.product_description },
            { name: "Cantidad", selector: (row) => row.quantity },
            { name: "Descripción", selector: (row) => row.description },
            { name: "Creado hace", selector: (row) => row.created_at ? calculateTimeAgo(row.created_at) : "N/A" },
            ...(status === "applied" ? [{
              name: "Hora de confirmación", selector: (row) => formatTimeFromDate(row.transfer_datetime)
            }] : []),
            ...(status === "pending" ? [{
              name: "Acciones",
              cell: (row) => (
                <CustomButton onClick={() => handleDelete(row)} disabled={row.description.includes("enviar")}>
                  <DeleteIcon />
                </CustomButton>
              ),
            }] : []),
          ]}
        />
      </Grid>
    </>
  );
};

export default TransferList;
