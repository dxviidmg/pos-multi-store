import React, { useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { importProducts, importProductsValidation } from "../apis/products";
import { Form, Row, Col } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import Swal from "sweetalert2";
import { ErrorIcon, SuccessIcon } from "../commons/icons/Icons";
import { useRef } from "react";


const URL_TEMPLATE =
  process.env.REACT_APP_API_URL +
  "/static/templates/SmartVenta_plantilla_importacion_productos.xlsx";

const DATA_SAMPLE = [
  { code: 1, brand: 'Refrescos Inc', name: "Nombre del producto 1", cost: 10, unit_price: 20, wholesale_price: 15, min_wholesale_quantity: 3, wholesale_price_on_client_discount: 'Si'},
  { code: 2, brand: 'Refrescos Inc', name: "Nombre del producto 2", cost: 12, unit_price: 22},
  { code: 3, brand: 'Refrescos Inc', name: "Nombre del producto 3", cost: 14, unit_price: 22, wholesale_price: 15, min_wholesale_quantity: 3},
];

const ProductImport = () => {
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    file: "",
  })
  const [showExample, setShowExample] = useState([]);

  const handleDataChange = (e) => {
    var { name, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleValidation = async () => {
    const response = await importProductsValidation(formData);

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
    const response = await importProducts(formData);

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
        <Form.Label className="fw-bold">Importar productos</Form.Label>
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
              products.length === 0 ||
              products.some((item) => item.status !== "Exitoso")
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


        <div className="custom-section" hidden={showExample}>
            <Form.Label className="fw-bold">Ejemplo de plantilla</Form.Label>

            <CustomTable
              data={DATA_SAMPLE}
              columns={[
                {
                  name: "Código",
                  selector: (row) => row.code,
                },
                {
                  name: "Marca",
                  selector: (row) => row.brand,
                },
                {
                  name: "Nombre",
                  selector: (row) => row.name,
                  wrap: true
                },
  
                {
                  name: "Costo",
                  selector: (row) => row.cost,
                },
                {
                  name: "Precio unitario",
                  selector: (row) => row.unit_price,
                },
                {
                  name: "Precio mayoreo",
                  selector: (row) => row.wholesale_price,
                },
  
                {
                  name: "Cantidad minima mayoreo",
                  selector: (row) => row.min_wholesale_quantity,
                },
                {
                  name: "Precio mayoreo en descuentos de clientes",
                  selector: (row) => row.wholesale_price_on_client_discount,
                }
              ]}
            ></CustomTable>


        </div>

      <div className="custom-section">
          <Form.Label className="fw-bold">Archivo actual</Form.Label>
          <CustomTable
            data={products}
            columns={[
              {
                name: "Código",
                selector: (row) => row.code,
              },
              {
                name: "Marca",
                selector: (row) => row.brand,
              },
              {
                name: "Nombre",
                selector: (row) => row.name,
                wrap: true
              },

              {
                name: "Costo",
                selector: (row) => row.cost,
              },
              {
                name: "Precio unitario",
                selector: (row) => row.unit_price,
              },
              {
                name: "Precio mayoreo",
                selector: (row) => row.wholesale_price,
              },

              {
                name: "Cantidad minima mayoreo",
                selector: (row) => row.min_wholesale_quantity,
              },
              {
                name: "Precio mayoreo en descuentos de clientes",
                selector: (row) => row.wholesale_price_on_client_discount,
              },
              {
                name: "Status",
                wrap: true,
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

export default ProductImport;
