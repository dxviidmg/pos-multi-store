import React, { useState } from "react";
import CustomTable from "../commons/customTable/CustomTable";
import { importStoreProducts, importStoreProductsValidation } from "../../api/products";

import CustomButton from "../commons/customButton/CustomButton";
import Swal from "sweetalert2";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRef } from "react";
import { Grid, Select, MenuItem, FormControl, InputLabel, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PublishIcon from "@mui/icons-material/Publish";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
  {
    value: "E",
    label: "Añadir",
  },
  {
    value: "A",
    label: "Sustituir",
  },
];

const StoreProductImport = () => {
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    file: "",
    action: "",
  });
  const [showExample, setShowExample] = useState([]);

  const handleDataChange = (e) => {
    var { name, value, files } = e.target;

    if (name === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleValidation = async () => {
    const response = await importStoreProductsValidation(formData);

    if (response.status === 200) {
      setProducts(response.data);

      Swal.fire({
        icon: "success",
        title: "Archivo cargado",
        timer: 5000,
      });
    } else if (response.status === 400) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar archivo",
        text: response.response.data.error,
        timer: 5000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al cargar archivo",
        text: "Llame a soporte",
        timer: 5000,
      });
    }
  };

  const handleImport = async () => {
    const response = await importStoreProducts(formData);

    if (response.status === 200) {
      setProducts([]);

      setFormData({ ...formData, file: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Limpia el input de archivo
      }

      Swal.fire({
        icon: "success",
        title: "Productos importados",
        timer: 5000,
      });
    } else if (response.status === 400) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar archivo",
        text: "Archivo incorrecto",
        timer: 5000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al cargar archivo",
        text: "Llame a soporte",
        timer: 5000,
      });
    }
  };

  return (
      <Grid container>
      <Grid item xs={12} className="custom-section">
        <h1>Importación de inventario</h1>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} className="d-flex flex-column justify-content-end">
            <CustomButton
              component="label"
              fullWidth
              startIcon={<CloudUploadIcon />}
            >
              Subir archivo
              <VisuallyHiddenInput
                type="file"
                ref={fileInputRef}
                onChange={handleDataChange}
                name="file"
              />
            </CustomButton>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>¿Desea adicionar o sustituir la cantidad?</InputLabel>
              <Select fullWidth size="small" value={formData.action}
              onChange={handleDataChange}
              name="action"
              //              disabled={isLoading}
             label="¿Desea adicionar o sustituir la cantidad?">
              <MenuItem value="">Tipo de operación</MenuItem>
              {ACTION_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomButton
              onClick={handleValidation}
              disabled={
                formData.file === "" ||
                formData.action === ""
              }
              fullWidth
              startIcon={<CheckCircleIcon />}
            >
              Validar
            </CustomButton>
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomButton
              onClick={handleImport}
              disabled={
                products.length === 0 ||
                products.some((item) => item.status !== "Exitoso")
              }
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
              startIcon={<VisibilityIcon />}
            >
              Ver Ejemplo
            </CustomButton>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} className="custom-section" hidden={showExample}>
        <h1>Ejemplo de plantilla</h1>

        <CustomTable
          data={DATA_SAMPLE}
          columns={[
            {
              name: "Código",
              selector: (row) => row.code,
            },
            {
              name: "Cantidad",
              selector: (row) => row.quantity,
            },
            {
              name: "Descripción (Opcional)",
              selector: (row) => row.description,
            }
          ]}
        ></CustomTable>
      </Grid>

      <Grid item xs={12} className="custom-section">
        <h1>Archivo actual</h1>
        <CustomTable
          data={products}
          columns={[
            {
              name: "Código",
              selector: (row) => row.code,
            },
            {
              name: "Cantidad",
              selector: (row) => row.quantity,
            },
            {
              name: "Descripcíon",
              selector: (row) => row.description,
            },

            {
              name: "Status",
              wrap: true,
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
        ></CustomTable>
      </Grid>
    </Grid>
  );
};

export default StoreProductImport;
