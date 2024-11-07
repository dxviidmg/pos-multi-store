import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { createProduct, getProducts } from "../apis/products";
import { Col, Form, Row } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import Swal from "sweetalert2";
import { getBrands } from "../apis/brands";

const ProductList = () => {
  const [products, setproducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    brand: "",
    code: "",
    name: "",
    purchase_price: "",
    unit_sale_price: "",
    wholesale_sale_price: null,
    min_wholesale_quantity: null,
    apply_wholesale_price_on_costumer_discount: false
  });

  const isFormIncomplete = () => {
    console.log(formData)
    // Separar los dos campos que pueden estar vacíos opcionalmente
    const { wholesale_sale_price, min_wholesale_quantity, ...requiredFields } =
      formData;

    // Verificar que los campos obligatorios no estén vacíos
    const areRequiredFieldsComplete = !Object.values(requiredFields).some(
      (value) => value === ""
    );

    // Verificar las condiciones de los campos opcionales
    const areOptionalFieldsConsistent =
      (wholesale_sale_price === "") === (min_wholesale_quantity === "");

    // La forma está incompleta si hay campos obligatorios vacíos o los opcionales son inconsistentes
    return !areRequiredFieldsComplete || !areOptionalFieldsConsistent;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const response = await getProducts();
      setproducts(response.data);
      setLoading(false)
      const response2 = await getBrands();
      setBrands(response2.data);
    };

    fetchData();
  }, []);

  const handleDataChange = async (e) => {
    let { name, value, checked } = e.target;

    console.log('c', name, 'v', value, checked)
    if (name === "apply_wholesale_price_on_costumer_discount"){
      value = checked
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));

//    console.log(formData);
  };

  const handleCreateproduct = async (e) => {
    console.log(formData)
    const response = await createProduct(formData);

    if (response.status === 201) {
      setproducts((prevproducts) => [...prevproducts, response.data]);

      Swal.fire({
        icon: "success",
        title: "producto creado",
        timer: 2000,
      });
    } else if (response.status === 400) {
      let text = "Error desconocido";
      if (response.response.data.code) {
        if (
          response.response.data.code[0] ===
          "product with this code already exists."
        ) {
          text = "El codigo ya existe";
        }
      }
      Swal.fire({
        icon: "error",
        title: "Error al crear producto",
        timer: 2000,
        text: text,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al crear producto",
        timer: 2000,
        text: "Error desconocido, por favor comuniquese con soporte",
      });
    }
  };

  return (
    <>
      <div>
        <Row className="section">
          <Form.Label className="fw-bold">Crear producto</Form.Label>
          <Col md={3}>
            <Form.Label>Marca</Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={formData.brand}
              onChange={handleDataChange}
              name="brand"
            >
              <option value="">Selecciona una marca</option>
              {brands.map((brands) => (
                <option key={brands.id} value={brands.id}>
                  {brands.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label>Codigo</Form.Label>
            <Form.Control
              type="text"
              value={formData.code}
              placeholder="Codigo"
              name="code"
              onChange={handleDataChange}
            />
          </Col>
          <Col md={6}>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              placeholder="Nombre"
              name="name"
              onChange={handleDataChange}
            />
          </Col>

          <Col md={3}>
            <Form.Label>Precio de compra</Form.Label>
            <Form.Control
              type="number"
              value={formData.purchase_price}
              placeholder="Precio de compra"
              name="purchase_price"
              onChange={handleDataChange}
            />
          </Col>

          <Col md={3}>
            <Form.Label>Precio de venta unitario</Form.Label>
            <Form.Control
              type="number"
              value={formData.unit_sale_price}
              placeholder="Precio de compra"
              name="unit_sale_price"
              onChange={handleDataChange}
            />
          </Col>

          <Col md={3}>
            <Form.Label>Precio de venta mayoreo</Form.Label>
            <Form.Control
              type="number"
              value={formData.wholesale_sale_price}
              placeholder="Precio de venta mayoreo"
              name="wholesale_sale_price"
              onChange={handleDataChange}
            />
          </Col>

          <Col md={3}>
            <Form.Label>Cantidad minima mayoreo</Form.Label>
            <Form.Control
              type="number"
              value={formData.min_wholesale_quantity}
              placeholder="Cantidad minima mayoreo"
              name="min_wholesale_quantity"
              onChange={handleDataChange}
            />
          </Col>
          <Col md={3}>
          <Form.Check // prettier-ignore
            type="checkbox"
            id={`default-checkbox`}
            label="Aplicar precio de mayoreo en descuento de cliente registrado"
            checked={formData.apply_wholesale_price_on_costumer_discount === true}
            onChange={handleDataChange}
            name = "apply_wholesale_price_on_costumer_discount"
          />
          </Col>

          <Col md={3}>
            <Form.Label></Form.Label>
            <CustomButton
              fullWidth={true}
              onClick={handleCreateproduct}
              disabled={isFormIncomplete()}
              marginTop="10px"
            >
              Crear producto
            </CustomButton>
          </Col>
        </Row>
      </div>
      <div>
        <Row className="section">
          <Form.Label className="fw-bold">Lista de productos</Form.Label>
          <CustomTable
            progressPending={loading}
            data={products}
            columns={[
              {
                name: "Codigo",
                selector: (row) => row.code,
              },
              {
                name: "Marca",
                selector: (row) => row.brand_name,
              },
              {
                name: "Nombre",
                selector: (row) => row.name,
                grow: 2,
                wrap: true
              },
              {
                name: "Precio de compra",
                selector: (row) => "$" + row.purchase_price,
                wrap: true,
              },
              {
                name: "Precio de venta unitario",
                selector: (row) => "$" + row.unit_sale_price,
              },
              {
                name: "Precio de venta mayoreo",
                selector: (row) =>
                  row.apply_wholesale
                    ? "$" +
                      row.wholesale_sale_price +
                      " apartir de " +
                      row.min_wholesale_quantity
                    : "NA",
              },
              {
                name: "Aplica PM sobre DC",
                selector: (row) =>
                  row.apply_wholesale_price_on_costumer_discount ? "Si" : "No",
              },
            ]}
          />
        </Row>
      </div>
    </>
  );
};

export default ProductList;
