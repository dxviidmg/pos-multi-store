import React, { useEffect, useState, useRef } from "react";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import {
  getImportCanIncludeQuantity,
  importProducts,
  importProductsValidation,
} from "../../../api/products";
import CustomButton from "../../ui/Button/Button";
import { showSuccess, showError } from "../../../utils/alerts";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import {
  Alert, Grid, Select, MenuItem, FormControl, InputLabel,
  Typography, styled, Stepper, Step, StepLabel, Chip,
  LinearProgress, Tooltip, Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PublishIcon from "@mui/icons-material/Publish";
import DownloadIcon from "@mui/icons-material/Download";
import ErrorIcon from "@mui/icons-material/Error";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const DropZone = styled('label')(({ theme, isDragging }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.5rem',
  border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: 12,
  cursor: 'pointer',
  backgroundColor: isDragging ? 'rgba(4, 52, 107, 0.06)' : 'transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(4, 52, 107, 0.04)',
  },
}));

const URL_TEMPLATE =
  process.env.REACT_APP_API_URL +
  "/static/templates/SmartVenta_plantilla_importacion_productos.xlsx";

const CREATE_OPTIONS = [
  { value: "Y", label: "Si" },
  { value: "N", label: "No" },
];

const productColumns = [
  { name: "Número de fila", selector: (row) => row.excel_row },
  { name: "Código", selector: (row) => row.code },
  { name: "Marca", selector: (row) => row.brand },
  { name: "Departamento", selector: (row) => row.departament },
  { name: "Nombre", selector: (row) => row.name },
  { name: "Costo", selector: (row) => row.cost },
  { name: "Precio unitario", selector: (row) => row.unit_price },
  { name: "Precio mayoreo", selector: (row) => row.wholesale_price },
  { name: "Cantidad mínima mayoreo", selector: (row) => row.min_wholesale_quantity },
  { name: "Precio mayoreo en descuentos de clientes", selector: (row) => row.wholesale_price_on_client_discount },
];

const ProductImport = () => {
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState([]);
  const [formData, setFormData] = useState({
    file: "",
    create_brands: "",
    create_departments: "",
    departments_mandatory: "",
    import_stock: "N",
  });
  const [canIncludeQuantity, setCanIncludeQuantity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getImportCanIncludeQuantity();
      setCanIncludeQuantity(!response.data);
      if (response.data) {
        setFormData((prev) => ({ ...prev, import_stock: "" }));
      }
    };
    fetchData();
  }, []);

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

  const fileTableRef = useRef(null);

  const handleValidation = async () => {
    setLoading(true);
    try {
      const response = await importProductsValidation(formData);
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
      const message = error.response?.data?.error || error.response?.data?.message || "Error al cargar archivo";
      showError("Error al validar", message);
    }
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      await importProducts(formData);
      setLoading(false);
      setProducts([]);
      setProductsError([]);
      setFormData({
        file: "",
        create_brands: "",
        create_departments: "",
        departments_mandatory: "",
        import_stock: canIncludeQuantity ? "N" : "",
      });
      setValidationResult(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      showSuccess("Productos importados");
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.error || "Error al importar";
      showError("Error al importar", message);
    }
  };

  const isFormIncomplete = formData.file === "" || formData.create_brands === "" ||
    formData.create_departments === "" || formData.departments_mandatory === "" || formData.import_stock === "";

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
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <h1>Importación de productos</h1>
          <CustomButton href={URL_TEMPLATE} startIcon={<DownloadIcon />}>
            Descargar plantilla
          </CustomButton>
        </Stack>

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
          {/* Col 1: Archivo */}
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

          {/* Col 2: Configuración */}
          <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>¿Crear marcas?</InputLabel>
              <Select value={formData.create_brands} onChange={handleDataChange} name="create_brands" label="¿Crear marcas?">
                <MenuItem value="">Seleccionar</MenuItem>
                {CREATE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>¿Crear departamentos?</InputLabel>
              <Select value={formData.create_departments} onChange={handleDataChange} name="create_departments" label="¿Crear departamentos?">
                <MenuItem value="">Seleccionar</MenuItem>
                {CREATE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>¿Deptos obligatorios?</InputLabel>
              <Select value={formData.departments_mandatory} onChange={handleDataChange} name="departments_mandatory" label="¿Deptos obligatorios?">
                <MenuItem value="">Seleccionar</MenuItem>
                {CREATE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {!canIncludeQuantity && (
              <>
                <FormControl fullWidth size="small">
                  <InputLabel>¿Agregar inventario?</InputLabel>
                  <Select value={formData.import_stock} onChange={handleDataChange} name="import_stock" label="¿Agregar inventario?">
                    <MenuItem value="">Seleccionar</MenuItem>
                    {CREATE_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Alert severity="info">
                  Primera vez aquí con una sola tienda: puedes agregar stock junto con los productos.
                </Alert>
              </>
            )}
          </Grid>

          {/* Col 3: Validar */}
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

          {/* Col 4: Importar */}
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
          data={products}
          columns={[
            ...productColumns,
            ...(formData.import_stock === "Y"
              ? [{ name: "Cantidad", selector: (row) => row.quantity }]
              : []),
            {
              name: "Estado",
              cell: (row) => (
                <Chip
                  size="small"
                  label={row.status}
                  color={row.status === "Exitoso" ? "success" : "error"}
                  variant="outlined"
                />
              ),
            },
          ]}
        />
      </Grid>
      )}
    </>
  );
};

export default ProductImport;
