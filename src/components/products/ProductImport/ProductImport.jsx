import React, { useEffect, useMemo, useState } from "react";
import { Alert, Grid, Select, MenuItem, FormControl, InputLabel, LinearProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CustomButton from "../../ui/Button/Button";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import PageHeader from "../../ui/PageHeader";
import ImportStepper from "../../ui/Import/ImportStepper";
import ImportFileDrop from "../../ui/Import/ImportFileDrop";
import ImportErrorRows from "../../ui/Import/ImportErrorRows";
import { ImportValidateButton, ImportSubmitButton } from "../../ui/Import/ImportActions";
import { useInvalidateCatalogOptions } from "../shared/useCatalogOptions";
import { getImportCanIncludeQuantity, importProducts, importProductsValidation } from "../../../api/products";
import { getStaticUrl } from "../../../api/utils";
import { useImportFlow } from "../../../hooks/useImportFlow";
import { showRequestError } from "../../../utils/alerts";

const URL_TEMPLATE = getStaticUrl("templates/SmartVenta_plantilla_importacion_productos.xlsx");

const YES_NO_OPTIONS = [
  { value: "Y", label: "Si" },
  { value: "N", label: "No" },
];

const CONFIG_FIELDS = [
  { name: "create_brands", label: "¿Crear marcas?" },
  { name: "create_departments", label: "¿Crear departamentos?" },
  { name: "departments_mandatory", label: "¿Deptos obligatorios?" },
];

const PRODUCT_COLUMNS = [
  { name: "Número de fila", selector: (row) => row.excel_row },
  { name: "Código", selector: (row) => row.code },
  { name: "Marca", selector: (row) => row.brand },
  { name: "Departamento", selector: (row) => row.departament },
  { name: "Nombre", selector: (row) => row.name },
  { name: "Costo", selector: (row) => row.cost },
  { name: "Precio unitario", selector: (row) => row.unit_price },
  { name: "Precio mayoreo", selector: (row) => row.wholesale_price },
  { name: "Cantidad mínima mayoreo", selector: (row) => row.min_wholesale_quantity },
  { name: "Permitir mayoreo con descuento de cliente", selector: (row) => row.wholesale_price_on_client_discount },
];

const QUANTITY_COLUMN = { name: "Cantidad", selector: (row) => row.quantity };

/** Sin la opción de inventario, `import_stock` va fijo en "N"; con ella el usuario debe elegir. */
const getInitialForm = (canIncludeQuantity) => ({
  file: "",
  create_brands: "",
  create_departments: "",
  departments_mandatory: "",
  import_stock: canIncludeQuantity ? "" : "N",
});

const YesNoSelect = ({ name, label, value, onChange }) => (
  <FormControl fullWidth size="small">
    <InputLabel>{label}</InputLabel>
    <Select value={value} onChange={onChange} name={name} label={label}>
      <MenuItem value="">Seleccionar</MenuItem>
      {YES_NO_OPTIONS.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
      ))}
    </Select>
  </FormControl>
);

const ProductImport = () => {
  // El backend permite agregar stock junto con los productos (primera importación con una sola tienda)
  const [canIncludeQuantity, setCanIncludeQuantity] = useState(false);
  const initialForm = useMemo(() => getInitialForm(canIncludeQuantity), [canIncludeQuantity]);
  const invalidateCatalogOptions = useInvalidateCatalogOptions();

  const {
    formData, setFormData, handleDataChange, fileInputRef, fileTableRef, dropZoneProps,
    loading, errorRows, validationResult, canImport, handleValidation, handleImport,
  } = useImportFlow({
    initialForm,
    validate: importProductsValidation,
    importFile: importProducts,
    importErrorAction: "importar los productos",
    importSuccessMessage: "Productos importados",
    onImported: invalidateCatalogOptions,
  });

  useEffect(() => {
    const fetchCanIncludeQuantity = async () => {
      try {
        const response = await getImportCanIncludeQuantity();
        setCanIncludeQuantity(response.data);
        if (response.data) {
          setFormData((prev) => ({ ...prev, import_stock: "" }));
        }
      } catch (error) {
        showRequestError("cargar la configuración de importación", error);
      }
    };
    fetchCanIncludeQuantity();
  }, [setFormData]);

  const isFormIncomplete = Object.values(formData).some((value) => value === "");

  return (
    <>
      <CustomSpinner isLoading={loading} />

      <Grid item xs={12} className="card" sx={{ mb: "1.5rem" }}>
        <PageHeader title="Importación de productos">
          <CustomButton fullWidth href={URL_TEMPLATE} startIcon={<DownloadIcon />}>Descargar plantilla</CustomButton>
        </PageHeader>

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
                <Alert severity="info">
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

      <ImportErrorRows
        rows={errorRows}
        columns={formData.import_stock === "Y" ? [...PRODUCT_COLUMNS, QUANTITY_COLUMN] : PRODUCT_COLUMNS}
        tableRef={fileTableRef}
        paginated
      />
    </>
  );
};

export default ProductImport;
