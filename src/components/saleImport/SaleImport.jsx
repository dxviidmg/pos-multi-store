import React, { useState } from "react";
import { Form } from "react-bootstrap";
import CustomTable from "../commons/customTable/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import { importSales, importSalesValidation } from "../apis/sales";
import Swal from "sweetalert2";
import { SuccessIcon, ErrorIcon } from "../commons/icons/Icons";
import { useRef } from "react";
import { Grid } from "@mui/material";

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
  const [formData, setFormData] = useState({
    file: "",
  });

  const [showExample, setShowExample] = useState(false);

  const [sales, setSales] = useState([]);

  const handleDataChange = (e) => {
    var { name, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleValidation = async () => {
    const response = await importSalesValidation(formData);

    if (response.status === 200) {
      setSales(response.data);

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
    const response = await importSales(formData);

    if (response.status === 200) {
      setSales([]);
      setFormData({ ...formData, file: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Limpia el input de archivo
      }
      Swal.fire({
        icon: "success",
        title: "Ventas importadas",
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
        <h1>Importar ventas</h1>
        <Grid container>
          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={2}>
            <CustomButton
              onClick={handleValidation}
              disabled={formData.file === ""}
              fullWidth
            >
              Validar
            </CustomButton>
          </Grid>

          <Grid item xs={12} md={2}>
            <CustomButton
              onClick={handleImport}
              disabled={
                sales.length === 0 ||
                sales.some((item) => item.status !== "Exitoso")
              }
              fullWidth
            >
              Importar
            </CustomButton>
          </Grid>

          <Grid item xs={12} md={2}>
            <CustomButton href={URL_TEMPLATE} fullWidth>
              Descargar plantilla
            </CustomButton>
          </Grid>

          <Grid item xs={12} md={2}>
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
                  name: "Descripción",
                  selector: (row) => row.description,
                },
              ]}
            ></CustomTable>

            <h1>Notas</h1>
            <p>
              1-.Las descripciones pueden ser NO Exactas la información de la
              base de datos, pero si una referencia en caso de que haya escrito
              mal el codigó. <br /> 2-. Podemos añadir el mismo producto en
              diferentes renglones haciendo referencia a que el mismo producto
              fue comprado varias veces.
            </p>
      </div>

      <div className="custom-section">
        <h1>Archivo actual</h1>
        <CustomTable
          data={sales}
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
              name: "Descripción",
              selector: (row) => row.product_description,
            },
            {
              name: "Status",
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

export default SaleImport;
