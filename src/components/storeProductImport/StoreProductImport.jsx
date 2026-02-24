import React, { useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { importStoreProducts, importStoreProductsValidation } from "../apis/products";
import { Form } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import Swal from "sweetalert2";
import { ErrorIcon, SuccessIcon } from "../commons/icons/Icons";
import { useRef } from "react";
import { Grid } from "@mui/material";

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
    <div>
      <div className="custom-section">
        <h1>Importación de inventario</h1>
        <Grid container>
          <Grid item xs={12} md={6} className="d-flex flex-column justify-content-end">
            <Form.Label>Archivo</Form.Label>

            <Form.Group controlId="formFile" className="">
              <Form.Control
                type="file"
                ref={fileInputRef}
                defaultValue={formData.file}
                onChange={handleDataChange}
                name="file"
              />
            </Form.Group>
          </Grid>

          <Grid item xs={12} md={6}>
            <Form.Label>¿Desea adicionar o sustituir la cantidad?</Form.Label>
            <Form.Select
              value={formData.action}
              onChange={handleDataChange}
              name="action"
              //              disabled={isLoading}
            >
              <option value="">Tipo de operación</option>
              {ACTION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomButton
              onClick={handleValidation}
              disabled={
                formData.file === "" ||
                formData.action === ""
              }
              fullWidth
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
            >
              Importar
            </CustomButton>
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomButton href={URL_TEMPLATE} fullWidth>
              Descargar plantilla
            </CustomButton>
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomButton
              onClick={() => setShowExample(!showExample)}
              fullWidth
            >
              Ver Ejemplo
            </CustomButton>
          </Grid>
        </Grid>
      </div>

      <div className="custom-section" hidden={showExample}>
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
      </div>

      <div className="custom-section">
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
                  <SuccessIcon />
                ) : (
                  <>
                    <ErrorIcon /> {row.status}
                  </>
                ),
            },
          ]}
        ></CustomTable>
      </div>
    </div>
  );
};

export default StoreProductImport;
