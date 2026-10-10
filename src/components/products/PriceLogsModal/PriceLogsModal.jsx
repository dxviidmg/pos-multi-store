import React, { useMemo } from "react";
import { Grid } from "@mui/material";
import CustomModal, { ModalBody } from "../../ui/Modal/Modal";
import DataTable from "../../ui/DataTable/DataTable";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { usePriceLogTable } from "../shared/usePriceLogTable";

const PriceLogsModal = ({ isOpen, product, onClose }) => {
  const productId = product?.id;
  const params = useMemo(() => ({ productId }), [productId]);
  const { rows, fieldColumns, isLoading } = usePriceLogTable(params, { enabled: Boolean(productId && isOpen) });

  const columns = useMemo(() => [
    ...fieldColumns,
    { name: "Usuario", selector: (row) => row.user },
  ], [fieldColumns]);

  return (
    <CustomModal showOut={isOpen} onClose={onClose} title={`Historial de precios — ${product?.name || ""}`}>
      <ModalBody>
        <Grid item xs={12} className="card">
          <CustomSpinner isLoading={isLoading} />
          <DataTable
            noDataComponent="Sin cambios de precio"
            data={rows}
            columns={columns}
          />
        </Grid>
      </ModalBody>
    </CustomModal>
  );
};

export default PriceLogsModal;
