import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import { createBrand, updateBrand } from "../apis/brands";
import Swal from "sweetalert2";
import { hideBrandModal } from "../redux/brandModal/BrandModalActions";

const BrandModal = ({ onUpdateBrandList }) => {
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

  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBrandSubmit = async () => {
    let response;
    if (formData.id) {
      response = await updateBrand(formData);
    } else {
      response = await createBrand(formData);
    }

    onUpdateBrandList(response.data);
    if (response.status === 200) {
      dispatch(hideBrandModal());
      setFormData({
        name: "",
      });
      Swal.fire({
        icon: "success",
        title: "Marca actualizada",
        timer: 5000,
      });
    } else if (response.status === 201) {
      dispatch(hideBrandModal());
      setFormData({
        name: "",
      });
      Swal.fire({
        icon: "success",
        title: "Marca creada",
        timer: 5000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al crear la marca",
        timer: 5000,
        text: "Error desconocido, por favor comuniquese con soporte",
      });
    }
  };

  return (
    <CustomModal showOut={showBrandModal} title={formData.id ? "Actualizar marca" : "Crear marca"}>
      <Row>
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

        <Col md={6} className="d-flex flex-column justify-content-end">
          <CustomButton
            fullWidth={true}
            onClick={handleBrandSubmit}
            disabled={formData.name === ""}
            marginTop="3px"
          >
            {formData.id ? "Actualizar" : "Crear"}
          </CustomButton>
        </Col>
      </Row>
    </CustomModal>
  );
};

export default BrandModal;
