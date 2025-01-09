import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import { createBrand, getBrands, updateBrand } from "../apis/brands";
import Swal from "sweetalert2";
import { hideProductModal } from "../redux/productModal/ProductModalActions";
import { createProduct, updateProduct } from "../apis/products";


const ProductModal = ({ onUpdateBrandList }) => {
  const { showBrandModal, product } = useSelector(
    (state) => state.ProductModalReducer
  );

  const [brands, setBrands] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({

        id: product.id || "",
        brand: product.brand || "",
        code: product.code || "",
        name: product.name || "",
        purchase_price: product.purchase_price || "",
        unit_sale_price: product.unit_sale_price || "",
        wholesale_sale_price: product.wholesale_sale_price || "",
        min_wholesale_quantity: product.min_wholesale_quantity || "",
        apply_wholesale_price_on_costumer_discount: product.apply_wholesale_price_on_costumer_discount || false

      });

      const fetchBrands = async () => {
        try {
          const response2 = await getBrands();
          setBrands(response2.data);
        } catch (error) {
          console.error("Error fetching brands:", error);
        }
      };
  
      fetchBrands();

    }
  }, [product]);



  const dispatch = useDispatch();

  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProductSubmit = async (e) => {

    let response

    const payload = { ...formData };

    // Si no aplica precio de mayoreo en descuento, eliminar los campos opcionales
    if (!formData.wholesale_sale_price || !formData.min_wholesale_quantity) {
      payload.wholesale_sale_price = null;
      payload.min_wholesale_quantity = null;
    }

    if (formData.id){
      response = await updateProduct(payload);
    }
    else{
      response = await createProduct(payload);
    }
    if (response.status === 200) {
//      setProducts((prevProducts) =>
//        prevProducts.map((product) =>
//          product.id === response.data.id ? response.data : product
//        )
//      );
      
      setFormData(
        {
          brand: "",
          code: "",
          name: "",
          purchase_price: "",
          unit_sale_price: "",
          wholesale_sale_price: "",
          min_wholesale_quantity: "",
          apply_wholesale_price_on_costumer_discount: false}
      )
      Swal.fire({
        icon: "success",
        title: "Producto actualizado",
        timer: 2000,
      });
    }
    else if (response.status === 201) {
//      setProducts((prevproducts) => [...prevproducts, response.data]);

      Swal.fire({
        icon: "success",
        title: "Producto creado",
        timer: 2000,
      });
    }

    else if (response.status === 400) {

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


  const isFormIncomplete = () => {
    // Separar los dos campos que pueden estar vacíos opcionalmente
    const { wholesale_sale_price, min_wholesale_quantity, apply_wholesale_price_on_costumer_discount, ...requiredFields } =
      formData;

    console.log(wholesale_sale_price, min_wholesale_quantity, requiredFields)

    // Verificar que los campos obligatorios no estén vacíos
    const areRequiredFieldsComplete = !Object.values(requiredFields).some(
      (value) => value === ""
    );

    // Verificar las condiciones de los campos opcionales
    const areOptionalFieldsConsistent =
      (wholesale_sale_price === "") === (min_wholesale_quantity === "");

    // La forma está incompleta si hay campos obligatorios vacíos o los opcionales son inconsistentes

    console.log('!areRequiredFieldsComplete || !areOptionalFieldsConsistent', !areRequiredFieldsComplete || !areOptionalFieldsConsistent)
    return !areRequiredFieldsComplete || !areOptionalFieldsConsistent;
  };


  return (
    <CustomModal showOut={showBrandModal} title={formData.id ? "Actualizar producto" : "Crear producto"}>
        <Row className="section">
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
            <Form.Label>Codigo</Form.Label>
            <Form.Control
              type="text"
              value={formData.code}
              placeholder="Codigo"
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
            <Form.Label>Precio de compra</Form.Label>
            <Form.Control
              type="number"
              value={formData.purchase_price}
              placeholder="Precio de compra"
              name="purchase_price"
              onChange={handleDataChange}
            />
          </Col>

          <Col md={4}>
            <Form.Label>Precio de venta unitario</Form.Label>
            <Form.Control
              type="number"
              value={formData.unit_sale_price}
              placeholder="Precio de venta unitario"
              name="unit_sale_price"
              onChange={handleDataChange}
            />
          </Col>

          <Col md={4}>
            <Form.Label>Precio de venta mayoreo</Form.Label>
            <Form.Control
              type="number"
              value={formData.wholesale_sale_price}
              placeholder="Precio de venta mayoreo"
              name="wholesale_sale_price"
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
            label="Aplicar precio de mayoreo en descuento de cliente registrado"
            checked={formData.apply_wholesale_price_on_costumer_discount === true}
            onChange={handleDataChange}
            name = "apply_wholesale_price_on_costumer_discount"
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
