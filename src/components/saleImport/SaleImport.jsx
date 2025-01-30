import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import CustomTable from "../commons/customTable/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import { importSales, importSalesValidation } from "../apis/sales";
import Swal from "sweetalert2";
import { SuccessIcon, ErrorIcon,  } from "../commons/icons/Icons";
import { useRef } from "react";


const DATA_SAMPLE = [
  { code: 1, cantidad: 1, description: "Descripción del producto 1" },
  { code: 2, cantidad: 2, description: "Descripción del producto 2" },
  { code: 1, cantidad: 3, description: "Descripción del producto 1" },
];

const URL_TEMPLATE =
  process.env.REACT_APP_API_URL +
  "/static/templates/SmartVenta_plantilla_importacion_ventas.xlsx";

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
        <Form.Label className="fw-bold">Importar ventas</Form.Label>
        <Row>
        <Col md={4}>
          <Form.Group controlId="formFile" className="">
            <Form.Control
              type="file"
              ref={fileInputRef}
              defaultValue={formData.file}
              onChange={handleDataChange}
              name="file"
            />
          </Form.Group>
        </Col>

        <Col md={2}>
          <CustomButton
            onClick={handleValidation}
            disabled={formData.file === ""}
            fullWidth
          >
            Validar
          </CustomButton>
        </Col>

        <Col md={2}>
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
        </Col>

        <Col md={2}>
          <CustomButton href={URL_TEMPLATE} fullWidth>
            Descargar plantilla
          </CustomButton>
        </Col>

        <Col md={2}>
          <CustomButton onClick={() => setShowExample(!showExample)} fullWidth>
            Ver Ejemplo
          </CustomButton>
        </Col>
        </Row>

      </div>

      {showExample && (
        <div className="custom-section">
          <Row>
          <Col md={9}>
            <Form.Label className="fw-bold">Ejemplo de plantilla</Form.Label>

            <CustomTable
              data={DATA_SAMPLE}
              columns={[
                {
                  name: "Código",
                  selector: (row) => row.code,
                },
                {
                  name: "Cantidad",
                  selector: (row) => row.cantidad,
                },
                {
                  name: "Descripción",
                  selector: (row) => row.description,
                },
              ]}
            ></CustomTable>


          </Col>

          <Col md={3}>
          <Form.Label className="fw-bold">Notas</Form.Label>
            <p>
              1-.Las descripciones pueden ser NO Exactas la
              información de la base de datos, pero si una referencia en caso de
              que haya escrito mal el codigó. <br /> 2-. Podemos añadir el mismo
              producto en diferentes renglones haciendo referencia a que el
              mismo producto fue comprado varias veces.
            </p>

            </Col>
          </Row>
        </div>
      )}

      <div className="custom-section">
          <Form.Label className="fw-bold">Archivo actual</Form.Label>
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
                selector: (row) => (
                  row.status === "Exitoso" 
                    ? <SuccessIcon /> 
                    : <>
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
