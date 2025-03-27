import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import { createDepartment, updateDepartment } from "../apis/departments";
import Swal from "sweetalert2";
import { hideDepartmentModal } from "../redux/departmentModal/DepartmentModalActions";

const DepartmentModal = ({ onUpdateDepartmentList }) => {
  const { showDepartmentModal, department } = useSelector(
    (state) => state.DepartmentModalReducer
  );

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (department) {
      setFormData({
        id: department.id || "",
        name: department.name || "",
      });
    }
  }, [department]);

  const dispatch = useDispatch();

  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDepartmentSubmit = async () => {
    let response;
    if (formData.id) {
      response = await updateDepartment(formData);
    } else {
      response = await createDepartment(formData);
    }

    onUpdateDepartmentList(response.data);
    if (response.status === 200) {
      dispatch(hideDepartmentModal());
      setFormData({
        name: "",
      });
      Swal.fire({
        icon: "success",
        title: "Marca actualizada",
        timer: 5000,
      });
    } else if (response.status === 201) {
      dispatch(hideDepartmentModal());
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
    <CustomModal showOut={showDepartmentModal} title={formData.id ? "Actualizar departamento" : "Crear departamento"}>

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
            onClick={handleDepartmentSubmit}
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

export default DepartmentModal;
