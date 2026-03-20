import React from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { calculateTimeAgo } from "../../../utils/utils";
import CustomButton from "../../ui/Button/Button";
import { showSuccess, showError } from "../../../utils/alerts";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { useTransfers, useDeleteTransfer } from "../../../hooks/useQueries";
import { Grid, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const TransferList = () => {
  const { data: transfers = [], isLoading } = useTransfers();
  const deleteTransferMutation = useDeleteTransfer();

  const handleDelete = async (transfer) => {
    try {
      await deleteTransferMutation.mutateAsync(transfer.id);
      showSuccess("Transferencia eliminada");
    } catch (error) {
      showError("Error al eliminar transferencia");
    }
  };

  return (
    <>
      <CustomSpinner isLoading={isLoading} />

      <Grid item xs={12} className="card">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <h1>Traspasos Pendientes</h1>
        </Stack>

        <DataTable
          noDataComponent="Sin traspasos pendientes"
          data={transfers}
          columns={[
            { name: "#", selector: (row) => row.id },
            { name: "Código", selector: (row) => row.product_code, grow: 2 },
            { name: "Producto", selector: (row) => row.product_description, grow: 4 },
            { name: "Cantidad", selector: (row) => row.quantity },
            { name: "Descripción", selector: (row) => row.description, grow: 4 },
            { name: "Antigüedad", selector: (row) => row.created_at ? calculateTimeAgo(row.created_at) : "N/A", grow: 2 },
            {
              name: "Acciones",
              grow: 2,
              cell: (row) => (
                <CustomButton onClick={() => handleDelete(row)} disabled={row.description.includes("prov")}>
                  <DeleteIcon />
                </CustomButton>
              ),
            },
          ]}
        />
      </Grid>
    </>
  );
};

export default TransferList;
