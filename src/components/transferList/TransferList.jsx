import React from "react";
import CustomTable from "../commons/customTable/CustomTable";
import { calculateTimeAgo } from "../../utils/utils";
import CustomButton from "../commons/customButton/CustomButton";
import { showSuccess, showError } from "../../utils/alerts";
import DeleteIcon from "@mui/icons-material/Delete";
import { CustomSpinner } from "../commons/customSpinner/CustomSpinner";
import { useTransfers, useDeleteTransfer } from "../../hooks/useQueries";

const TransferList = () => {
  const { data: transfers = [], isLoading } = useTransfers();
  const deleteTransferMutation = useDeleteTransfer();

  const handleOpenModal = async (transfer) => {
    try {
      await deleteTransferMutation.mutateAsync(transfer.id);
      showSuccess("Transferencia eliminada");
    } catch (error) {
      showError("Error al eliminar transferencia");
    }
  };


  return (
    <>
      <CustomSpinner isLoading={isLoading}></CustomSpinner>
      <div className="">
        <CustomTable
          noDataComponent="Sin traspasos pendientes"
          data={transfers}
          columns={[
            {
              name: "#",
              selector: (row) => row.id,
            },
            {
              name: "Código",
              selector: (row) => row.product_code,
              grow: 2,
            },
            {
              name: "Producto",
              selector: (row) => row.product_description,
              grow: 4,
              wrap: true,
            },
            {
              name: "Cantidad",
              selector: (row) => row.quantity,
            },

            {
              name: "Descripción",
              selector: (row) => row.description,
              wrap: true,
              grow: 4,
            },
            {
              name: "Creado hace",
              selector: (row) => calculateTimeAgo(row.created_at),
              grow: 2
            },
            {
              name: "Acciones",
              selector: (row) => (
                <CustomButton onClick={() => handleOpenModal(row)} disabled={row.description.includes('prov')}>
                  <DeleteIcon />
                </CustomButton>
              ),
              grow: 2,
            },
          ]}
        />
      </div>
    </>
  );
};

export default TransferList;
