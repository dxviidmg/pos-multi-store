import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import {
  getImportCanIncludeQuantity,
  importProducts,
  importProductsValidation,
} from "../apis/products";
import { Form, Row, Col, Alert } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import Swal from "sweetalert2";
import { chooseIcon } from "../commons/icons/Icons";
import { useRef } from "react";
import { CustomSpinner } from "../commons/customSpinner/CustomSpinner";

const URL_TEMPLATE =
  process.env.REACT_APP_API_URL +
  "/static/templates/SmartVenta_plantilla_importacion_productos.xlsx";

const DATA_SAMPLE = [
  {
    code: 1,
    brand: "Marca 1",
    name: "Nombre del producto 1",
    departament: "Departamento 1",
    cost: 10,
    unit_price: 20,
    wholesale_price: 15,
    min_wholesale_quantity: 3,
    wholesale_price_on_client_discount: "Si",
  },
  {
    code: 2,
    brand: "Marca 2",
    departament: "Departamento 1",
    name: "Nombre del producto 2",
    cost: 12,
    unit_price: 22,
  },
  {
    code: 3,
    brand: "Marca 3",
    departament: "",
    name: "Nombre del producto 3",
    cost: 14,
    unit_price: 22,
    wholesale_price: 15,
    min_wholesale_quantity: 3,
  },
];

const CREATE_OPTIONS = [
  {
    value: "Y",
    label: "Si",
  },
  {
    value: "N",
    label: "No",
  },
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
  const [showExample, setShowExample] = useState([]);
  const [canIncludeQuantity, setCanIncludeQuantity] = useState(false);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const response = await getImportCanIncludeQuantity();
      setCanIncludeQuantity(!response.data);

      if (response.data) {
        setFormData((prevData) => ({ ...prevData, import_stock: "" }));
      }
    };

    fetchData();
  }, []);

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
    setLoading(true)
    const response = await importProductsValidation(formData);
    setLoading(false)

    if (response.status === 200) {
      setProducts(response.data);

      const productsError = response.data.filter(
        (item) => item.status !== "Exitoso"
      );
      setProductsError(productsError);

      const text =
        productsError.length > 0
          ? productsError.length + " filas tienen errores"
          : "Todas las filas estan bien ";

      Swal.fire({
        icon: "success",
        title: "Archivo cargado",
        timer: 5000,
        text: text,
      });
    } else if (response.status === 400) {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Limpia el input de archivo
      }
      Swal.fire({
        icon: "error",
        title: "Error al cargar archivo",
        text: response.response.data.error,
        timer: 5000,
      });
      
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Limpia el input de archivo
      }
      Swal.fire({
        icon: "error",
        title: "Error al cargar archivo",
        text: "Llame a soporte",
        timer: 5000,
      });
    }
  };

  const handleImport = async () => {
    setLoading(true)
    const response = await importProducts(formData);
    setLoading(false)

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

  const handleShowData = async () => {
    setProducts(productsError);
    Swal.fire({
      icon: "success",
      title: "Mostrando productos con error",
      timer: 5000,
    });
  };

  return (
    <div>
      <CustomSpinner isLoading={loading}></CustomSpinner>
      <div className="custom-section">
        <h1>Importación de productos</h1>
        <Row>
          <Col md={3} className="d-flex flex-column justify-content-end">
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
          </Col>

          <Col md={3}>
            <Form.Label>¿Crear marcas en caso que no existan?</Form.Label>
            <Form.Select
              value={formData.create_brands}
              onChange={handleDataChange}
              name="create_brands"
              //              disabled={isLoading}
            >
              <option value="">Crear marcas</option>
              {CREATE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Label>
              ¿Crear departamentos en caso que no existan?
            </Form.Label>
            <Form.Select
              value={formData.create_departments}
              onChange={handleDataChange}
              name="create_departments"
              //              disabled={isLoading}
            >
              <option value="">Crear departamentos</option>
              {CREATE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Label>¿El campo "Departamentos" es obligatorio?</Form.Label>
            <Form.Select
              value={formData.departments_mandatory}
              onChange={handleDataChange}
              name="departments_mandatory"
              //              disabled={isLoading}
            >
              <option value="">Departamentos obligatorios en el archivo</option>
              {CREATE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={12} hidden={canIncludeQuantity} className="mt-3">
            <Alert key={"primary"} variant={"primary"}>
              Posiblemente sea tu primera vez aqui y tienes solo una tienda, por
              lo que aparte de importar tus productos puedes ponerle tu stick en
              tu tienda/almacen.
            </Alert>

            <Form.Label>
              ¿Agregar inventario a la primera tienda? Ideal para la primera
              importación si solo tienes una tienda.
            </Form.Label>
            <Form.Select
              value={formData.import_stock}
              onChange={handleDataChange}
              name="import_stock"
              //              disabled={isLoading}
            >
              <option value="">Agregar inventario</option>
              {CREATE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <CustomButton
              onClick={handleValidation}
              disabled={
                formData.file === "" ||
                formData.create_brands === "" ||
                formData.create_departments === "" ||
                formData.departments_mandatory === "" ||
                formData.import_stock === ""
              }
              fullWidth
            >
              Validar
            </CustomButton>
          </Col>

          <Col md={3}>
            {productsError.length > 0 ? (
              <CustomButton onClick={handleShowData} fullWidth>
                Ver registros con error
              </CustomButton>
            ) : (
              <CustomButton onClick={handleImport} fullWidth
              disabled={
                products.length === 0 ||
                products.some((item) => item.status !== "Exitoso")
              }>
                Importar
              </CustomButton>
            )}
          </Col>

          <Col md={3}>
            <CustomButton href={URL_TEMPLATE} fullWidth>
              Descargar plantilla
            </CustomButton>
          </Col>

          <Col md={3}>
            <CustomButton
              onClick={() => setShowExample(!showExample)}
              fullWidth
            >
              Ver Ejemplo
            </CustomButton>
          </Col>
        </Row>

        <Row hidden={canIncludeQuantity}></Row>
      </div>

      <div className="custom-section" hidden={showExample}>
        <h1>Ejemplo de plantilla</h1>

        <CustomTable
          data={DATA_SAMPLE}
          columns={[
            {
              name: "# Col",
              selector: (row) => row.excel_row,
            },
            {
              name: "Código",
              selector: (row) => row.code,
            },
            {
              name: "Marca",
              selector: (row) => row.brand,
            },
            {
              name: "Departamento",
              selector: (row) => row.departament,
            },
            {
              name: "Nombre",
              selector: (row) => row.name,
              wrap: true,
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
          ]}
        ></CustomTable>
      </div>

      <div className="custom-section">
        <h1>Archivo actual</h1>
        <CustomTable
          data={products}
          columns={[
            {
              name: "Col en excel",
              selector: (row) => row.excel_row,
            },
            {
              name: "Código",
              selector: (row) => row.code,
              grow: 1.1
            },
            {
              name: "Marca",
              selector: (row) => row.brand,
            },

            {
              name: "Departamento",
              selector: (row) => row.departament,
            },

            {
              name: "Nombre",
              selector: (row) => row.name,
              wrap: true,
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
            ...(formData.import_stock === "Y"
              ? [
                  {
                    name: "Cantidad",
                    selector: (row) => row.quantity,
                  },
                ]
              : []),
            {
              name: "Status",
              wrap: true,
              selector: (row) => (
                <>
                  {chooseIcon(row.status === "Exitoso")}
                  {row.status !== "Exitoso" && row.status}
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
