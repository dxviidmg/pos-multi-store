import React, { useState, useRef } from "react";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import { importStoreProducts, importStoreProductsValidation } from "../../../api/products";
import CustomButton from "../../ui/Button/Button";
import { showSuccess, showError } from "../../../utils/alerts";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import PageHeader from "../../ui/PageHeader";
import DropZone from "../../ui/DropZone";
import VisuallyHiddenInput from "../../ui/VisuallyHiddenInput";
import StatusChip from "../../ui/StatusChip";
import {
  Grid, Select, MenuItem, FormControl, InputLabel,
  Typography, Stepper, Step, StepLabel, Chip,
  LinearProgress, Tooltip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PublishIcon from "@mui/icons-material/Publish";
import DownloadIcon from "@mui/icons-material/Download";
import ErrorIcon from "@mui/icons-material/Error";

const URL_TEMPLATE =
  process.env.REACT_APP_API_URL +
  "/static/templates/SmartVenta_plantilla_importacion_inventario_o_ventas.xlsx";

const ACTION_OPTIONS = [
  { value: "E", label: "Añadir" },
  { value: "A", label: "Sustituir" },
];

const productColumns = [
  { name: "Código", selector: (row) => row.code },
  { name: "Cantidad", selector: (row) => row.quantity },
  { name: "Descripción", selector: (row) => row.description },
];

const StoreProductImport = () => {
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState([]);
  const [formData, setFormData] = useState({ file: "", action: "" });
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const fileTableRef = useRef(null);

  const handleDataChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "file" ? files[0] : value,
    }));
    if (name === "file") {
      setProducts([]);
      setProductsError([]);
      setValidationResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFormData((prev) => ({ ...prev, file }));
      setProducts([]);
      setProductsError([]);
      setValidationResult(null);
    }
  };

  const handleValidation = async () => {
    setLoading(true);
    try {
      const response = await importStoreProductsValidation(formData);
      setLoading(false);
      setProducts(response.data);
      const errors = response.data.filter((item) => item.status !== "Exitoso");
      const successes = response.data.length - errors.length;
      setProductsError(errors);
      setValidationResult({ successes, errors: errors.length });
      const text = errors.length > 0
        ? `${errors.length} filas tienen errores. Corrige los errores y vuelve a subir el archivo.`
        : "Todas las filas están bien";
      showSuccess("Archivo cargado", text);
      if (errors.length > 0) {
        setTimeout(() => fileTableRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
      }
    } catch (error) {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      showError("Error al validar", error.response?.data?.error || "Error al cargar archivo");
    }
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      await importStoreProducts(formData);
      setLoading(false);
      setProducts([]);
      setProductsError([]);
      setFormData({ file: "", action: "" });
      setValidationResult(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      showSuccess("Productos importados");
    } catch (error) {
      setLoading(false);
      showError("Error al importar", error.response?.data?.error || "Error al importar");
    }
  };

  const isFormIncomplete = formData.file === "" || formData.action === "";
  const canImport = products.length > 0 && products.every((item) => item.status === "Exitoso");

  const activeStep = !formData.file ? 0 : isFormIncomplete ? 1 : !validationResult ? 2 : 3;
  const steps = [
    "Subir archivo",
    "Configurar",
    validationResult ? "Validado" : "Validar",
    "Importar",
  ];

  return (
    <>
      <CustomSpinner isLoading={loading} />

      <Grid item xs={12} className="card" sx={{ mb: '1.5rem' }}>
        <PageHeader title="Importación de inventario">
          <CustomButton href={URL_TEMPLATE} startIcon={<DownloadIcon />}>Descargar plantilla</CustomButton>
        </PageHeader>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3,
          '& .MuiStepIcon-root.Mui-completed': { color: 'success.main' },
          '& .MuiStepLabel-label.Mui-completed': { color: 'success.main' },
        }}>
          {steps.map((label, index) => (
            <Step key={index} completed={index < activeStep || (index === 2 && !!validationResult)}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <DropZone
              isDragging={isDragging}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <CloudUploadIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                Arrastra tu archivo o haz clic para seleccionar
              </Typography>
              {formData.file && (
                <Chip label={formData.file.name} color="primary" size="small" sx={{ mt: 1 }} />
              )}
              <VisuallyHiddenInput type="file" ref={fileInputRef} onChange={handleDataChange} name="file" />
            </DropZone>
          </Grid>

          <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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

          <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <CustomButton
              onClick={handleValidation}
              disabled={isFormIncomplete}
              fullWidth
              color={validationResult?.errors > 0 ? "error" : "primary"}
              startIcon={validationResult?.errors > 0
                ? <ErrorIcon sx={{ color: 'error.main' }} />
                : <CheckCircleIcon sx={{ color: isFormIncomplete ? 'inherit' : 'success.main' }} />
              }
            >
              {validationResult
                ? validationResult.errors > 0 ? "Tiene errores" : "Validado"
                : "Validar"}
            </CustomButton>
            {validationResult && (
              <>
                <Chip icon={<CheckCircleIcon />} label={`${validationResult.successes} exitosos`} color="success" variant="outlined" />
                <Chip icon={<ErrorIcon />} label={`${validationResult.errors} con error`} color="error" variant="outlined" />
              </>
            )}
          </Grid>

          <Grid item xs={12} md={3}>
            <Tooltip title={!canImport ? "Primero valida el archivo sin errores" : ""}>
              <span>
                <CustomButton onClick={handleImport} fullWidth disabled={!canImport} startIcon={<PublishIcon sx={{ color: canImport ? 'success.main' : 'inherit' }} />}>
                  Importar
                </CustomButton>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>

      {productsError.length > 0 && (
        <Grid item xs={12} className="card" ref={fileTableRef}>
          <h1>Filas con error</h1>
          <SimpleTable
            noDataComponent="Sin filas con error"
            data={products}
            columns={[
              ...productColumns,
                { name: "Estado", cell: (row) => <StatusChip status={row.status} /> },
            ]}
          />
        </Grid>
      )}
    </>
  );
};

export default StoreProductImport;
