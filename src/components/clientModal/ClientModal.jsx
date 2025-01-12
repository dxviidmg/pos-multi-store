import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import Swal from "sweetalert2";
import { getDiscounts } from "../apis/discounts";
import { createClient, updateClient } from "../apis/clients";
import { hideClientModal } from "../redux/clientModal/ClientModalActions";

const INITIAL_FORM_DATA = {
  first_name: "",
  last_name: "",
  phone_number: "",
  discount: "",
};

const ClientModal = ({ onUpdateClientList }) => {
  const { showClientModal, client } = useSelector(
    (state) => state.ClientModalReducer
  );

  const [discounts, setDiscounts] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await getDiscounts();
        setDiscounts(response.data);
      } catch (error) {
        console.error("Error fetching discounts", error);
        Swal.fire({
          icon: "error",
          title: "Error al cargar descuentos",
          text: "Por favor, intente de nuevo más tarde.",
          timer: 5000,
        });
      }
    };

    if (client) {
      setFormData(client);
    } else {
      setFormData(INITIAL_FORM_DATA);
    }

    fetchDiscounts();
  }, [client]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isFormIncomplete = Object.values(formData).some((value) => value === "");

  const handleSaveClient = async () => {
      const apiCall = formData.id ? updateClient : createClient;
      const response = await apiCall(formData);

      if ([200, 201].includes(response.status)) {
        dispatch(hideClientModal());
        onUpdateClientList(response.data);
        setFormData(INITIAL_FORM_DATA);

        Swal.fire({
          icon: "success",
          title: `Cliente ${formData.id ? "actualizado" : "creado"}`,
          timer: 5000,
        });
      } else {
        handleClientError(response);
      }
  };

  const handleClientError = (response) => {
    let message = "Error desconocido. Por favor, contacte soporte.";

    if (response?.status === 400 && response.data.phone_number) {
      const phoneError = response.data.phone_number[0];
      if (phoneError === "Ensure this field has at least 10 characters.") {
        message = "El teléfono debe tener al menos 10 dígitos.";
      } else if (phoneError === "client with this phone number already exists.") {
        message = "El teléfono ya existe.";
      }
    }

    Swal.fire({
      icon: "error",
      title: "Error al guardar cliente",
      text: message,
      timer: 5000,
    });
  };
  return (
    <CustomModal
      showOut={showClientModal}
      title={formData ? "Actualizar marca" : "Crear marca"}
    >
      <Row className={`section`}>
        <Col>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={formData.first_name}
            placeholder="Nombre"
            name="first_name"
            onChange={handleInputChange}
          />
        </Col>
        <Col md={3}>
          <Form.Label>Apellidos</Form.Label>
          <Form.Control
            type="text"
            value={formData.last_name}
            placeholder="Apellidos"
            name="last_name"
            onChange={handleInputChange}
          />
        </Col>
        <Col md={3}>
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            value={formData.phone_number}
            placeholder="Teléfono"
            name="phone_number"
            onChange={handleInputChange}
          />
        </Col>
        <Col md={3}>
          <Form.Label>Descuento</Form.Label>
          <Form.Select
            aria-label="Select discount"
            value={formData.discount}
            onChange={handleInputChange}
            name="discount"
          >
            <option value="">Descuento</option>
            {discounts.map((discount) => (
              <option key={discount.id} value={discount.id}>
                {discount.discount_percentage}%
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <CustomButton
            fullWidth
            onClick={handleSaveClient}
            disabled={isFormIncomplete}
            marginTop="10px"
          >
            {formData.id ? "Actualizar" : "Crear"} cliente
          </CustomButton>
        </Col>
      </Row>
    </CustomModal>
  );
};

export default ClientModal;
