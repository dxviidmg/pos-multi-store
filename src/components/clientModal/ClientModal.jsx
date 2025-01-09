import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import Swal from "sweetalert2";
import { getDiscounts } from "../apis/discounts";
import { createClient, updateClient } from "../apis/clients";
import { hideClientModal } from "../redux/clientModal/ClientModalActions";

const ClientModal = ({ onUpdateClientList }) => {
  const { showClientModal, client } = useSelector(
    (state) => state.ClientModalReducer
  );

  const [discounts, setDiscounts] = useState([]);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    discount: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [discountsResponse] = await Promise.all([getDiscounts()]);
        setDiscounts(discountsResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    if (client) {
      setFormData(client);
    }

    fetchData();
  }, [client]);

  const dispatch = useDispatch();


  const handleClientInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isClientFormIncomplete = () => {
    return Object.values(formData).some((value) => value === "");
  };

  const handleSaveClient = async () => {
    try {
      const response = formData.id
        ? await updateClient(formData)
        : await createClient(formData);

      if (response.status === 200 || response.status === 201) {
        dispatch(hideClientModal());
        onUpdateClientList(response.data);
        setFormData({
          first_name: "",
          last_name: "",
          phone_number: "",
          discount: "",
        });

        Swal.fire({
          icon: "success",
          title: `Cliente ${formData.id ? "actualizado" : "creado"}`,
          timer: 2000,
        });
      }
      else{

        handleClientError(response);
      }
    } catch (error) {
    }
  };

  const handleClientError = (response) => {
    let message = "Error desconocido, por favor comuníquese con soporte";

    if (response.response?.status === 400 && response.response.data.phone_number) {
      const phoneError = response.response.data.phone_number[0];
      if (phoneError === "Ensure this field has at least 10 characters.") {
        message = "El teléfono debe tener 10 dígitos";
      } else if (phoneError === "client with this phone number already exists.") {
        message = "El teléfono ya existe";
      }
    }

    Swal.fire({
      icon: "error",
      title: "Error al crear cliente",
      text: message,
      timer: 2000,
    });
  };

  return (
    <CustomModal
      showOut={showClientModal}
      title={formData ? "Actualizar marca" : "Crear marca"}
    >
      <Row className={`section${"aa" === "admin" ? "-left" : ""}`}>
        <Form.Label className="fw-bold">Crear cliente</Form.Label>
        <Col>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={formData.first_name}
            placeholder="Nombre"
            name="first_name"
            onChange={handleClientInputChange}
          />
        </Col>
        <Col md={3}>
          <Form.Label>Apellidos</Form.Label>
          <Form.Control
            type="text"
            value={formData.last_name}
            placeholder="Apellidos"
            name="last_name"
            onChange={handleClientInputChange}
          />
        </Col>
        <Col md={3}>
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            value={formData.phone_number}
            placeholder="Teléfono"
            name="phone_number"
            onChange={handleClientInputChange}
          />
        </Col>
        <Col md={3}>
          <Form.Label>Descuento</Form.Label>
          <Form.Select
            aria-label="Select discount"
            value={formData.discount}
            onChange={handleClientInputChange}
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
            disabled={isClientFormIncomplete()}
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
