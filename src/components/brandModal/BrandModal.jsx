import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import { hideBrandModal } from "../redux/brandModal/BrandModalActions";
import { useCreateBrand, useUpdateBrand } from "../../hooks/useBrandMutations";

const BrandModal = ({ onUpdateBrandList }) => {
  const { showBrandModal, brand } = useSelector(
    (state) => state.BrandModalReducer
  );

  const [formData, setFormData] = useState({
    name: "",
  });

  const dispatch = useDispatch();
  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();

  useEffect(() => {
    if (brand) {
      setFormData({
        id: brand.id || "",
        name: brand.name || "",
      });
    } else {
      setFormData({ name: "" });
    }
  }, [brand]);

  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBrandSubmit = async () => {
    const mutation = formData.id ? updateMutation : createMutation;
    
    mutation.mutate(formData, {
      onSuccess: () => {
        dispatch(hideBrandModal());
        onUpdateBrandList();
        setFormData({ name: "" });
      },
    });
  };

  return (
    <CustomModal 
      showOut={showBrandModal} 
      onClose={() => dispatch(hideBrandModal())}
      title={formData.id ? "Actualizar marca" : "Crear marca"}
    >
      <div className="custom-section">

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
      </div>
    </CustomModal>
  );
};

export default BrandModal;
