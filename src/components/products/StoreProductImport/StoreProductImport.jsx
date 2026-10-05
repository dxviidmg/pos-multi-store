import React from "react";
import { Grid, Select, MenuItem, FormControl, InputLabel, LinearProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CustomButton from "../../ui/Button/Button";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import PageHeader from "../../ui/PageHeader";
import ImportStepper from "../../ui/Import/ImportStepper";
import ImportFileDrop from "../../ui/Import/ImportFileDrop";
import ImportErrorRows from "../../ui/Import/ImportErrorRows";
import { ImportValidateButton, ImportSubmitButton } from "../../ui/Import/ImportActions";
import { importStoreProducts, importStoreProductsValidation } from "../../../api/products";
import { getStaticUrl } from "../../../api/utils";
import { useImportFlow } from "../../../hooks/useImportFlow";

const URL_TEMPLATE = getStaticUrl("templates/SmartVenta_plantilla_importacion_inventario_o_ventas.xlsx");

const ACTION_OPTIONS = [
  { value: "E", label: "Agregar" },
  { value: "A", label: "Sustituir" },
];

const INITIAL_FORM = { file: "", action: "" };

const PRODUCT_COLUMNS = [
  { name: "Código", selector: (row) => row.code },
  { name: "Cantidad", selector: (row) => row.quantity },
  { name: "Descripción", selector: (row) => row.description },
];

const StoreProductImport = () => {
  const {
    formData, handleDataChange, fileInputRef, fileTableRef, dropZoneProps,
    loading, errorRows, validationResult, canImport, handleValidation, handleImport,
  } = useImportFlow({
    initialForm: INITIAL_FORM,
    validate: importStoreProductsValidation,
    importFile: importStoreProducts,
    importErrorAction: "importar el inventario",
    importSuccessMessage: "Productos importados",
  });

  const isFormIncomplete = formData.file === "" || formData.action === "";

  return (
    <>
      <CustomSpinner isLoading={loading} />

      <Grid item xs={12} className="card" sx={{ mb: "1.5rem" }}>
        <PageHeader title="Importación de inventario">
          <CustomButton fullWidth href={URL_TEMPLATE} startIcon={<DownloadIcon />}>Descargar plantilla</CustomButton>
        </PageHeader>

        <ImportStepper hasFile={!!formData.file} withConfig configured={!isFormIncomplete} validated={!!validationResult} />

        {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <ImportFileDrop dropZoneProps={dropZoneProps} file={formData.file} fileInputRef={fileInputRef} onChange={handleDataChange} />
          </Grid>

          <Grid item xs={12} md={3} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Acción</InputLabel>
              <Select value={formData.action} onChange={handleDataChange} name="action" label="Acción">
                <MenuItem value="">Tipo de operación</MenuItem>
                {ACTION_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <ImportValidateButton onClick={handleValidation} disabled={isFormIncomplete} validationResult={validationResult} />
          </Grid>

          <Grid item xs={12} md={3}>
            <ImportSubmitButton onClick={handleImport} canImport={canImport} />
          </Grid>
        </Grid>
      </Grid>

      <ImportErrorRows rows={errorRows} columns={PRODUCT_COLUMNS} tableRef={fileTableRef} />
    </>
  );
};

export default StoreProductImport;
