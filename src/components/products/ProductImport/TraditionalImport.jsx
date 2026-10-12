import React, { useMemo } from "react";
import { Alert, Grid, LinearProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CustomButton from "../../ui/Button/Button";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import PageHeader from "../../ui/PageHeader";
import ImportStepper from "../../ui/Import/ImportStepper";
import ImportFileDrop from "../../ui/Import/ImportFileDrop";
import { ImportValidateButton, ImportSubmitButton } from "../../ui/Import/ImportActions";
import EditableErrorRows from "./EditableErrorRows";
import YesNoSelect from "./YesNoSelect";
import ZeroStockSelector from "./ZeroStockSelector";
import { getTemplateFields } from "./importFields";
import { useEditableImport } from "./useEditableImport";
import { importProducts, importProductsValidation } from "../../../api/products";
import { getStaticUrl } from "../../../api/utils";

const URL_TEMPLATE = getStaticUrl("templates/SmartVenta_plantilla_importacion_productos.xlsx");

const CONFIG_FIELDS = [
  { name: "create_brands", label: "¿Crear marcas?" },
  { name: "create_departments", label: "¿Crear departamentos?" },
  { name: "departments_mandatory", label: "¿Deptos obligatorios?" },
];

const BASE_FORM = { file: "", create_brands: "", create_departments: "", departments_mandatory: "" };

const TraditionalImport = ({ tabs }) => {
  const {
    formData, handleDataChange, fileInputRef, fileTableRef, dropZoneProps,
    loading, errorRows, validationResult, canImport, handleValidation, handleImport, saveRowEdit, removeRows,
    canIncludeQuantity, zeroStockRows, selectedIds, setSelectedIds,
    excludedCount, removedCount, originalCount, importCount,
  } = useEditableImport({ baseForm: BASE_FORM, validateApi: importProductsValidation, importApi: importProducts });

  const isFormIncomplete = Object.values(formData).some((value) => value === "");
  const fields = useMemo(() => getTemplateFields({ showStock: formData.import_stock === "Y" }), [formData.import_stock]);

  return (
    <>
      <CustomSpinner isLoading={loading} />

      <Grid item xs={12} className="card" sx={{ mb: "1.5rem" }}>
        <PageHeader title="Importación de productos">
          <CustomButton fullWidth href={URL_TEMPLATE} startIcon={<DownloadIcon />}>Descargar plantilla</CustomButton>
        </PageHeader>

        {tabs}

        <ImportStepper hasFile={!!formData.file} withConfig configured={!isFormIncomplete} validated={!!validationResult} />

        {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <ImportFileDrop dropZoneProps={dropZoneProps} file={formData.file} fileInputRef={fileInputRef} onChange={handleDataChange} />
          </Grid>

          <Grid item xs={12} md={3} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {CONFIG_FIELDS.map(({ name, label }) => (
              <YesNoSelect key={name} name={name} label={label} value={formData[name]} onChange={handleDataChange} />
            ))}
            {canIncludeQuantity && (
              <>
                <YesNoSelect name="import_stock" label="¿Agregar inventario?" value={formData.import_stock} onChange={handleDataChange} />
                <Alert severity="info" variant="filled">
                  Primera vez aquí con una sola tienda: puedes agregar stock junto con los productos.
                </Alert>
              </>
            )}
          </Grid>

          <Grid item xs={12} md={3} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <ImportValidateButton onClick={handleValidation} disabled={isFormIncomplete} validationResult={validationResult} />
          </Grid>

          <Grid item xs={12} md={3}>
            <ImportSubmitButton onClick={handleImport} canImport={canImport} />
          </Grid>
        </Grid>
      </Grid>

      <EditableErrorRows rows={errorRows} tableRef={fileTableRef} fields={fields} disabled={loading} onSave={saveRowEdit} onRemove={removeRows} />

      <ZeroStockSelector
        rows={zeroStockRows}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
        importCount={importCount}
        originalCount={originalCount}
        removedCount={removedCount}
        excludedCount={excludedCount}
        canImport={canImport}
        onImport={handleImport}
      />
    </>
  );
};

export default TraditionalImport;
