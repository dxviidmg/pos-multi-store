import React, { useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { calculateTimeAgo, formatTimeFromDate } from "../../../utils/utils";
import CustomButton from "../../ui/Button/Button";
import { useTransfers, useDeleteTransfer } from "../../../hooks/useTransfers";
import { Grid, MenuItem, FormControl, InputLabel, Select, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PageHeader from "../../ui/PageHeader";
import CustomTooltip from "../../ui/Tooltip";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pendientes" },
  { value: "applied", label: "Aplicados" },
];

const TransferList = () => {
  const [status, setStatus] = useState("pending");
  const { data: transfers = [], isLoading } = useTransfers({ status });
  // El hook muestra el mensaje de éxito o error.
  const deleteTransferMutation = useDeleteTransfer();

  const handleDelete = (transfer) => {
    deleteTransferMutation.mutate(transfer.id);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const filterDescription = status === "applied"
    ? "Solo traspasos de hoy"
    : "Sin filtro de fecha";

  return (
    <Grid item xs={12} className="card">
      <PageHeader title="Traspasos" />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Estado</InputLabel>
            <Select value={status} onChange={handleStatusChange} label="Estado">
              {STATUS_OPTIONS.map((opt) => (
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
              <CustomTooltip text="Eliminar">
                <CustomButton onClick={() => handleDelete(row)} disabled={row.description.includes("enviar")}>
                  <DeleteIcon />
                </CustomButton>
              </CustomTooltip>
            ),
          }] : []),
        ]}
      />
    </Grid>
  );
};

export default TransferList;
