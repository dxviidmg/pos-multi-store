import React, { useMemo } from "react";
import { Alert, FormControl, Grid, InputLabel, LinearProgress, MenuItem } from "@mui/material";
import { TextField, Select } from "../../ui/Field/Field";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import PageHeader from "../../ui/PageHeader";
import ImportStepper from "../../ui/Import/ImportStepper";
import ImportFileDrop from "../../ui/Import/ImportFileDrop";
import { ImportValidateButton, ImportSubmitButton } from "../../ui/Import/ImportActions";
import YesNoSelect from "./YesNoSelect";
import { getEleventaFields } from "./importFields";
import ImportResults from "./ImportResults";
import { isMinQuantityValid, MIN_WHOLESALE_QUANTITY, useEleventaImport } from "./useEleventaImport";

const WHOLESALE_OPTIONS = [
  { value: "quantity", label: "Usar una cantidad mínima" },
  { value: "ignore", label: "Solo precio de menudeo" },
];

const EleventaImport = ({ tabs }) => {
  const {
    formData, handleDataChange, fileInputRef, fileTableRef, dropZoneProps,
    loading, errorRows, validationResult, canImport, handleValidation, handleImport, saveRowEdit, removeRows,
    canIncludeQuantity, isFormIncomplete, zeroStockRows, selectedIds, setSelectedIds,
    excludedCount, removedCount, originalCount, importCount,
  } = useEleventaImport();

  const fields = useMemo(
    () => getEleventaFields({ showWholesale: formData.wholesale_mode === "quantity" }),
    [formData.wholesale_mode]
  );

  return (
    <>
      <CustomSpinner isLoading={loading} />

      <Grid item xs={12} className="card" sx={{ mb: "1.5rem" }}>
        <PageHeader title="Importación de productos" />

        {tabs}

        <ImportStepper hasFile={!!formData.file} withConfig configured={!isFormIncomplete} validated={!!validationResult} />

        {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

        <Grid container className="fill-row" spacing={2}>
          <Grid item xs={12} md={3}>
            <ImportFileDrop dropZoneProps={dropZoneProps} file={formData.file} fileInputRef={fileInputRef} onChange={handleDataChange} />
          </Grid>

          <Grid item xs={12} md={3} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              size="small"
              label="Marca de los productos"
              name="brand"
              value={formData.brand}
              onChange={handleDataChange}
              inputProps={{ maxLength: 100 }}
              error={formData.brand.trim() === ""}
              helperText="Tu reporte no incluye marca; se usará esta para todos."
            />
            <Alert severity="info" variant="filled">
              El reporte no incluye la cantidad mínima de mayoreo. Elige si usas una cantidad por defecto
              en los productos con precio mayoreo o si solo se toma el precio de menudeo.
            </Alert>
            <FormControl fullWidth size="small">
              <InputLabel>Precio mayoreo</InputLabel>
              <Select value={formData.wholesale_mode} onChange={handleDataChange} name="wholesale_mode" label="Precio mayoreo">
                <MenuItem value="">Seleccionar</MenuItem>
                {WHOLESALE_OPTIONS.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {formData.wholesale_mode === "quantity" && (
              <TextField
                size="small"
                type="number"
                label="Cantidad mínima de mayoreo"
                name="min_wholesale_quantity"
                value={formData.min_wholesale_quantity}
                onChange={handleDataChange}
                inputProps={{ min: MIN_WHOLESALE_QUANTITY, step: 1 }}
                error={!isMinQuantityValid(formData.min_wholesale_quantity)}
                helperText={`Entero de ${MIN_WHOLESALE_QUANTITY} o más`}
              />
            )}
            {canIncludeQuantity ? (
              <>
                <YesNoSelect name="import_stock" label="¿Agregar inventario?" value={formData.import_stock} onChange={handleDataChange} />
                <Alert severity="info" variant="filled">
                  Primera vez aquí con una sola tienda: puedes agregar el inventario del reporte.
                </Alert>
              </>
            ) : (
              <Alert severity="info" variant="filled">
                Tu negocio tiene varias sucursales o ya tiene inventario: el inventario del reporte se ignora.
              </Alert>
            )}
          </Grid>

          <Grid item xs={12} md={3} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <ImportValidateButton onClick={handleValidation} disabled={isFormIncomplete || !formData.file} validationResult={validationResult} />
          </Grid>

          <Grid item xs={12} md={3}>
            <ImportSubmitButton onClick={handleImport} canImport={canImport} />
          </Grid>
        </Grid>
      </Grid>

      <ImportResults
        fields={fields}
        loading={loading}
        tableRef={fileTableRef}
        errorRows={errorRows}
        zeroStockRows={zeroStockRows}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        importCount={importCount}
        originalCount={originalCount}
        removedCount={removedCount}
        excludedCount={excludedCount}
        canImport={canImport}
        onSave={saveRowEdit}
        onRemove={removeRows}
        onImport={handleImport}
      />
    </>
  );
};

export default EleventaImport;
