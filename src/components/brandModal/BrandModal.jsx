import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../commons/customTable/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import { hideStockModal } from "../redux/stockModal/StockModalActions";
import { createTransfer } from "../apis/transfers";
import { createBrand, updateBrand } from "../apis/brands";
import Swal from "sweetalert2";
import { hideBrandModal } from "../redux/brandModal/BrandModalActions";


const BrandModal = ({onUpdateBrandList}) => {
  const { showBrandModal, brand } = useSelector(
    (state) => state.BrandModalReducer
  );

  const [formData, setFormData] = useState({
    name: "",
  });


  useEffect(() => {
    if (brand) {
      setFormData({
        id: brand.id || "",
        name: brand.name || "",
      });
    }
  }, [brand]);

  const dispatch = useDispatch();

  const [requestedQuantities, setRequestedQuantities] = useState({});

  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleQuantityChange = (rowId, max, value) => {
    value = parseInt(value);

    if (value > max) {
      value = max;
    }
    setRequestedQuantities((prev) => ({
      ...prev,
      [rowId]: value,
    }));
  };

  const handleBrandSubmit = async () => {
    let response;
    if (formData.id) {
      response = await updateBrand(formData);
    } else {
      response = await createBrand(formData);
    }

    onUpdateBrandList(response.data)
    if (response.status === 200) {
      //      setBrands((prevProducts) =>
      //        prevProducts.map((product) =>
      //          product.id === response.data.id ? response.data : product
      //        )
      //      );


      dispatch(hideBrandModal());
      setFormData({
        name: "",
      });
      Swal.fire({
        icon: "success",
        title: "Marca actualizada",
        timer: 2000,
      });
    } else if (response.status === 201) {
      //      setBrands((prevproducts) => [...prevproducts, response.data]);

      Swal.fire({
        icon: "success",
        title: "Marca creada",
        timer: 2000,
      });
    } else if (response.status === 400) {
      let text = "Error desconocido";
      Swal.fire({
        icon: "error",
        title: "Error al crear marca",
        timer: 2000,
        text: text,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al crear la marca",
        timer: 2000,
        text: "Error desconocido, por favor comuniquese con soporte",
      });
    }
  };

  return (
    <CustomModal showOut={showBrandModal} title="Crear marca">
      <Row className="section">
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

        <Col md={6}>
          <Form.Label>.</Form.Label>
          <CustomButton
            fullWidth={true}
            onClick={handleBrandSubmit}
            disabled={formData.name === ""}
            marginTop="3px"
          >
            {formData.id ? "Actualizar" : "Crear"} marca
          </CustomButton>
        </Col>
      </Row>
    </CustomModal>
  );
};

export default BrandModal;
