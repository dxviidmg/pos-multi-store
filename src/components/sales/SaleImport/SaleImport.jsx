import React, { useState, useRef } from "react";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import CustomButton from "../../ui/Button/Button";
import { importSales, importSalesValidation } from "../../../api/sales";
import { showSuccess, showError } from "../../../utils/alerts";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import PageHeader from "../../ui/PageHeader";
import DropZone from "../../ui/DropZone";
import VisuallyHiddenInput from "../../ui/VisuallyHiddenInput";
import StatusChip from "../../ui/StatusChip";
import {
  Grid, Typography, Stepper, Step, StepLabel, Chip,
  LinearProgress, Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PublishIcon from "@mui/icons-material/Publish";
import DownloadIcon from "@mui/icons-material/Download";
import ErrorIcon from "@mui/icons-material/Error";

const URL_TEMPLATE =
  process.env.REACT_APP_API_URL +
  "/static/templates/SmartVenta_plantilla_importacion_inventario_o_ventas.xlsx";

const saleColumns = [
  { name: "Código", selector: (row) => row.code },
  { name: "Cantidad", selector: (row) => row.quantity },
  { name: "Descripción", selector: (row) => row.product_description },
];

const SaleImport = () => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({ file: "" });
  const [sales, setSales] = useState([]);
  const [salesError, setSalesError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const fileTableRef = useRef(null);

  const handleDataChange = (e) => {
    setFormData({ file: e.target.files[0] });
    setSales([]);
    setSalesError([]);
    setValidationResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFormData({ file });
      setSales([]);
      setSalesError([]);
      setValidationResult(null);
    }
  };

  const handleValidation = async () => {
    setLoading(true);
    try {
      const response = await importSalesValidation(formData);
      setLoading(false);
      setSales(response.data);
      const errors = response.data.filter((item) => item.status !== "Exitoso");
      const successes = response.data.length - errors.length;
      setSalesError(errors);
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
      await importSales(formData);
      setLoading(false);
      setSales([]);
      setSalesError([]);
      setFormData({ file: "" });
      setValidationResult(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      showSuccess("Ventas importadas");
    } catch (error) {
      setLoading(false);
      showError("Error al importar", error.response?.data?.error || "Error al importar");
    }
  };

  const isFormIncomplete = formData.file === "";
  const canImport = sales.length > 0 && sales.every((item) => item.status === "Exitoso");

  const activeStep = !formData.file ? 0 : !validationResult ? 1 : 2;
  const steps = [
    "Subir archivo",
    validationResult ? "Validado" : "Validar",
    "Importar",
  ];

  return (
    <>
      <CustomSpinner isLoading={loading} />

      <Grid item xs={12} className="card" sx={{ mb: '1.5rem' }}>
        <PageHeader title="Importar ventas">
          <CustomButton href={URL_TEMPLATE} startIcon={<DownloadIcon />}>Descargar plantilla</CustomButton>
        </PageHeader>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3,
          '& .MuiStepIcon-root.Mui-completed': { color: 'success.main' },
          '& .MuiStepLabel-label.Mui-completed': { color: 'success.main' },
        }}>
          {steps.map((label, index) => (
            <Step key={index} completed={index < activeStep || (index === 1 && !!validationResult)}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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

          <Grid item xs={12} md={4}>
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

      {salesError.length > 0 && (
        <Grid item xs={12} className="card" ref={fileTableRef}>
          <h1>Filas con error</h1>
          <SimpleTable
            data={sales}
            columns={[
              ...saleColumns,
                { name: "Estado", cell: (row) => <StatusChip status={row.status} /> },
            ]}
          />
        </Grid>
      )}
    </>
  );
};

export default SaleImport;
