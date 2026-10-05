import React from "react";
import { Grid, LinearProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CustomButton from "../../ui/Button/Button";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import PageHeader from "../../ui/PageHeader";
import ImportStepper from "../../ui/Import/ImportStepper";
import ImportFileDrop from "../../ui/Import/ImportFileDrop";
import ImportErrorRows from "../../ui/Import/ImportErrorRows";
import { ImportValidateButton, ImportSubmitButton } from "../../ui/Import/ImportActions";
import { importSales, importSalesValidation } from "../../../api/sales";
import { getStaticUrl } from "../../../api/utils";
import { useImportFlow } from "../../../hooks/useImportFlow";

const URL_TEMPLATE = getStaticUrl("templates/SmartVenta_plantilla_importacion_inventario_o_ventas.xlsx");

const INITIAL_FORM = { file: "" };

const SALE_COLUMNS = [
  { name: "Código", selector: (row) => row.code },
  { name: "Cantidad", selector: (row) => row.quantity },
  { name: "Descripción", selector: (row) => row.product_description },
];

const SaleImport = () => {
  const {
    formData, handleDataChange, fileInputRef, fileTableRef, dropZoneProps,
    loading, errorRows, validationResult, canImport, handleValidation, handleImport,
  } = useImportFlow({
    initialForm: INITIAL_FORM,
    validate: importSalesValidation,
    importFile: importSales,
    importErrorAction: "importar las ventas",
    importSuccessMessage: "Ventas importadas",
  });

  const isFormIncomplete = formData.file === "";

  return (
    <>
      <CustomSpinner isLoading={loading} />

      <Grid item xs={12} className="card" sx={{ mb: "1.5rem" }}>
        <PageHeader title="Importar ventas">
          <CustomButton fullWidth href={URL_TEMPLATE} startIcon={<DownloadIcon />}>Descargar plantilla</CustomButton>
        </PageHeader>

        <ImportStepper hasFile={!!formData.file} validated={!!validationResult} />

        {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <ImportFileDrop dropZoneProps={dropZoneProps} file={formData.file} fileInputRef={fileInputRef} onChange={handleDataChange} />
          </Grid>

          <Grid item xs={12} md={4} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <ImportValidateButton onClick={handleValidation} disabled={isFormIncomplete} validationResult={validationResult} />
          </Grid>

          <Grid item xs={12} md={4}>
            <ImportSubmitButton onClick={handleImport} canImport={canImport} />
          </Grid>
        </Grid>
      </Grid>

      <ImportErrorRows rows={errorRows} columns={SALE_COLUMNS} tableRef={fileTableRef} />
    </>
  );
};

export default SaleImport;
