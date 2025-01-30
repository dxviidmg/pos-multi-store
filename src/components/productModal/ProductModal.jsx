import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import { getBrands } from "../apis/brands";
import Swal from "sweetalert2";
import { hideProductModal } from "../redux/productModal/ProductModalActions";
import { createProduct, updateProduct } from "../apis/products";


const INITIAL_FORM_DATA = {
  brand: "",
  code: "",
  name: "",
  cost: "",
  unit_price: "",
  wholesale_price: "",
  min_wholesale_quantity: "",
  wholesale_price_on_client_discount: false

}

const ProductModal = ({ onUpdateProductList }) => {
  const { showBrandModal, product } = useSelector(
    (state) => state.ProductModalReducer
  );

  const [brands, setBrands] = useState([]);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
    else{
      setFormData(INITIAL_FORM_DATA)
    }


    const fetchBrands = async () => {
      try {
        const response2 = await getBrands();
        setBrands(response2.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();



  }, [product]);



  const dispatch = useDispatch();

  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProductSubmit = async (e) => {

    const payload = { ...formData };

    // Si no aplica precio de mayoreo en descuento, eliminar los campos opcionales
    if (!formData.wholesale_price || !formData.min_wholesale_quantity) {
      payload.wholesale_price = null;
      payload.min_wholesale_quantity = null;
    }

    const apiCall = payload.id ? updateProduct : createProduct;
    const response = await apiCall(payload);

    if ([200, 201].includes(response.status)) {
      dispatch(hideProductModal());
      onUpdateProductList(response.data);
      setFormData(INITIAL_FORM_DATA);

      Swal.fire({
        icon: "success",
        title: `Producto ${formData.id ? "actualizado" : "creado"}`,
        timer: 5000,
      });
    } else {
      handleClientError(response);
      }

  };

  const handleClientError = (response) => {
    let message = "Error desconocido. Por favor, contacte soporte.";

    if (response.response?.status === 400 && response.response.data?.code) {
      const codeError = response.response.data.code[0];
      if (codeError === "product with this code already exists.") {
        message = "El código ya existe.";
      }
    }

    Swal.fire({
      icon: "error",
      title: `Error al ${formData.id ? "actualizar" : "crear"} producto`,
      text: message,
      timer: 5000,
    })
  }

  const isFormIncomplete = () => {
    // Separar los dos campos que pueden estar vacíos opcionalmente
    const { wholesale_price, min_wholesale_quantity, wholesale_price_on_client_discount, ...requiredFields } =
      formData;

    // Verificar que los campos obligatorios no estén vacíos
    const areRequiredFieldsComplete = !Object.values(requiredFields).some(
      (value) => value === ""
    );


    // Verificar las condiciones de los campos opcionales
    const areOptionalFieldsConsistent =
      (wholesale_price === "") === (min_wholesale_quantity === "");

    // La forma está incompleta si hay campos obligatorios vacíos o los opcionales son inconsistentes

    return !areRequiredFieldsComplete || !areOptionalFieldsConsistent;
  };


  return (
    <CustomModal showOut={showBrandModal} title={formData.id ? "Actualizar producto" : "Crear producto"}>

      <Row>
          <Col md={4}>
            <Form.Label>Marca</Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={formData.brand}
              onChange={handleDataChange}
              name="brand"
//              disabled={isLoading}
            >
              <option value="">Selecciona una marca</option>
              {brands.map((brands) => (
                <option key={brands.id} value={brands.id}>
                  {brands.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Código</Form.Label>
            <Form.Control
              type="text"
              value={formData.code}
              placeholder="Código"
              name="code"
              onChange={handleDataChange}
            />
          </Col>
          <Col md={4}>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              placeholder="Nombre"
              name="name"
              onChange={handleDataChange}
            />
          </Col>

          <Col md={4}>
            <Form.Label>Costo</Form.Label>
            <Form.Control
              type="number"
              value={formData.cost}
              placeholder="Costo"
              name="cost"
              onChange={handleDataChange}
            />
          </Col>

          <Col md={4}>
            <Form.Label>Precio unitario</Form.Label>
            <Form.Control
              type="number"
              value={formData.unit_price}
              placeholder="Precio unitario"
              name="unit_price"
              onChange={handleDataChange}
            />
          </Col>

          <Col md={4}>
            <Form.Label>Precio de mayoreo</Form.Label>
            <Form.Control
              type="number"
              value={formData.wholesale_price}
              placeholder="Precio de mayoreo"
              name="wholesale_price"
              onChange={handleDataChange}
            />
          </Col>

          <Col md={4}>
            <Form.Label>Cantidad minima mayoreo</Form.Label>
            <Form.Control
              type="number"
              value={formData.min_wholesale_quantity}
              placeholder="Cantidad minima mayoreo"
              name="min_wholesale_quantity"
              onChange={handleDataChange}
            />
          </Col>
          <Col md={4}>
          <Form.Check // prettier-ignore
            type="checkbox"
            id={`default-checkbox`}
            label="Precio de mayoreo en descuento de cliente registrado"
            checked={formData.wholesale_price_on_client_discount === true}
            onChange={handleDataChange}
            name = "wholesale_price_on_client_discount"
          />
          </Col>

          <Col md={4}>
            <Form.Label></Form.Label>
            <CustomButton
              fullWidth={true}
              onClick={handleProductSubmit}
              disabled={isFormIncomplete()}
              marginTop="10px"
            >
              {formData.id ? 'Actualizar': 'Crear'} producto
            </CustomButton>
          </Col>
        </Row>


    </CustomModal>
  );
};

export default ProductModal;
