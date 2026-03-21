import React, { useState, useRef } from "react";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import { importStoreProducts, importStoreProductsValidation } from "../../../api/products";
import CustomButton from "../../ui/Button/Button";
import { showSuccess, showError } from "../../../utils/alerts";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PublishIcon from "@mui/icons-material/Publish";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Grid, Select, MenuItem, FormControl, InputLabel, Typography, styled } from "@mui/material";

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

const URL_TEMPLATE =
  process.env.REACT_APP_API_URL +
  "/static/templates/SmartVenta_plantilla_importacion_inventario.xlsx";

const DATA_SAMPLE = [
  { code: 1, quantity: 1, description: "Descripción del producto 1" },
  { code: 2, quantity: 2, description: "Descripción del producto 2" },
];

const ACTION_OPTIONS = [
  { value: "E", label: "Añadir" },
  { value: "A", label: "Sustituir" },
];

const StoreProductImport = () => {
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ file: "", action: "" });
  const [showExample, setShowExample] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDataChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "file" ? files[0] : value,
    }));
  };

  const handleValidation = async () => {
    setLoading(true);
    const response = await importStoreProductsValidation(formData);
    setLoading(false);

    if (response.status === 200) {
      setProducts(response.data);
      showSuccess("Archivo cargado");
    } else if (response.status === 400) {
      showError("Error al cargar archivo", response.response.data.error);
    } else {
      showError("Error al cargar archivo", "Llame a soporte");
    }
  };

  const handleImport = async () => {
    setLoading(true);
    const response = await importStoreProducts(formData);
    setLoading(false);

    if (response.status === 200) {
      setProducts([]);
      setFormData({ ...formData, file: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
      showSuccess("Productos importados");
    } else if (response.status === 400) {
      showError("Error al cargar archivo", "Archivo incorrecto");
    } else {
      showError("Error al cargar archivo", "Llame a soporte");
    }
  };

  return (
    <>
      <CustomSpinner isLoading={loading} />

      <Grid item xs={12} className="card" sx={{ mb: '1.5rem' }}>
        <h1>Importación de inventario</h1>
        {formData.file && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            Archivo: {formData.file.name}
          </Typography>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <CustomButton component="label" fullWidth startIcon={<CloudUploadIcon />}>
              Subir archivo
              <VisuallyHiddenInput type="file" ref={fileInputRef} onChange={handleDataChange} name="file" />
            </CustomButton>
          </Grid>
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={3}>
            <CustomButton onClick={handleValidation} disabled={!formData.file || !formData.action} fullWidth startIcon={<CheckCircleIcon />}>
              Validar
            </CustomButton>
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomButton
              onClick={handleImport}
              disabled={products.length === 0 || products.some((item) => item.status !== "Exitoso")}
              fullWidth startIcon={<PublishIcon />}
            >
              Importar
            </CustomButton>
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomButton href={URL_TEMPLATE} fullWidth startIcon={<DownloadIcon />}>
              Descargar plantilla
            </CustomButton>
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomButton
              onClick={() => setShowExample(!showExample)}
              fullWidth
              startIcon={showExample ? <VisibilityOffIcon /> : <VisibilityIcon />}
            >
              {showExample ? "Ocultar ejemplo" : "Ver ejemplo"}
            </CustomButton>
          </Grid>
        </Grid>
      </Grid>

      {showExample && (
        <Grid item xs={12} className="card" sx={{ mb: '1.5rem' }}>
          <h1>Ejemplo de plantilla</h1>
          <SimpleTable
            data={DATA_SAMPLE}
            columns={[
              { name: "Código", selector: (row) => row.code },
              { name: "Cantidad", selector: (row) => row.quantity },
              { name: "Descripción (Opcional)", selector: (row) => row.description },
            ]}
          />
        </Grid>
      )}

      <Grid item xs={12} className="card">
        <h1>Archivo actual</h1>
        <SimpleTable
          data={products}
          columns={[
            { name: "Código", selector: (row) => row.code },
            { name: "Cantidad", selector: (row) => row.quantity },
            { name: "Descripción", selector: (row) => row.description },
            {
              name: "Estado",
              selector: (row) =>
                row.status === "Exitoso" ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <>
                    <CancelIcon color="error" /> {row.status}
                  </>
                ),
            },
          ]}
        />
      </Grid>
    </>
  );
};

export default StoreProductImport;
