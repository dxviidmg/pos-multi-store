import React, { useState, useRef } from "react";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import CustomButton from "../../ui/Button/Button";
import { importSales, importSalesValidation } from "../../../api/sales";
import { showSuccess, showError } from "../../../utils/alerts";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Grid, Typography, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PublishIcon from "@mui/icons-material/Publish";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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

const DATA_SAMPLE = [
  { code: 1, quantity: 1, description: "Descripción del producto 1" },
  { code: 2, quantity: 2, description: "Descripción del producto 2" },
  { code: 1, quantity: 3, description: "Descripción del producto 1" },
];

const URL_TEMPLATE =
  process.env.REACT_APP_API_URL +
  "/static/templates/SmartVenta_plantilla_importacion_inventario_o_ventas.xlsx";

const SaleImport = () => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({ file: "" });
  const [showExample, setShowExample] = useState(false);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDataChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleValidation = async () => {
    setLoading(true);
    const response = await importSalesValidation(formData);
    setLoading(false);

    if (response.status === 200) {
      setSales(response.data);
      showSuccess("Archivo cargado");
    } else if (response.status === 400) {
      showError("Error al cargar archivo", response.response.data.error);
    } else {
      showError("Error al cargar archivo", "Llame a soporte");
    }
  };

  const handleImport = async () => {
    setLoading(true);
    const response = await importSales(formData);
    setLoading(false);

    if (response.status === 200) {
      setSales([]);
      setFormData({ file: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
      showSuccess("Ventas importadas");
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
        <h1>Importar ventas</h1>
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
            <CustomButton onClick={handleValidation} disabled={!formData.file} fullWidth startIcon={<CheckCircleIcon />}>
              Validar
            </CustomButton>
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomButton
              onClick={handleImport}
              disabled={sales.length === 0 || sales.some((item) => item.status !== "Exitoso")}
              fullWidth
              startIcon={<PublishIcon />}
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
              { name: "Descripción", selector: (row) => row.description },
            ]}
          />
          <h1>Notas</h1>
          <p>
            1-. Las descripciones pueden ser NO exactas a la información de la
            base de datos, pero sí una referencia en caso de que haya escrito
            mal el código. <br /> 2-. Podemos añadir el mismo producto en
            diferentes renglones haciendo referencia a que el mismo producto
            fue comprado varias veces.
          </p>
        </Grid>
      )}

      <Grid item xs={12} className="card">
        <h1>Archivo actual</h1>
        <SimpleTable
          data={sales}
          columns={[
            { name: "Código", selector: (row) => row.code },
            { name: "Cantidad", selector: (row) => row.quantity },
            { name: "Descripción", selector: (row) => row.product_description },
            {
              name: "Status",
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

export default SaleImport;
