import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { createClient, getClients } from "../apis/clients";
import { Col, Form, Row } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { getDiscounts } from "../apis/discounts";
import Swal from "sweetalert2";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    discount: "",
  });

  const isFormIncomplete = () => {
    return Object.values(formData).some((value) => value === "");
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getClients();
      setClients(response.data);
      const response2 = await getDiscounts();
      setDiscounts(response2.data);
    };

    fetchData();
  }, []);

  const handleDataChange = async (e) => {
    let { name, value } = e.target;

    if (name === "discount") {
      value = parseInt(value);
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreateClient = async (e) => {
    const response = await createClient(formData);

    if (response.status === 201) {
      setClients((prevClients) => [...prevClients, response.data]);
      Swal.fire({
        icon: "success",
        title: "Cliente creado",
        timer: 2000,
      });
    } else if (response.status === 400) {
      let text = "Error desconocido";
      if (response.response.data.phone_number) {
        if (
          response.response.data.phone_number[0] ===
          "Ensure this field has at least 10 characters."
        ) {
          text = "El telefono debe tener 10 digitos";
        }
        if (
          response.response.data.phone_number[0] ===
          "client with this phone number already exists."
        ) {
          text = "El telefono ya existe";
        }
      }
      Swal.fire({
        icon: "error",
        title: "Error al crear cliente",
        timer: 2000,
        text: text,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al crear cliente",
        timer: 2000,
        text: "Error desconocido, por favor comuniquese con soporte",
      });
    }
  };

  return (
    <>
      <div>
        <Row className="section">
          <Form.Label className="fw-bold">Crear cliente</Form.Label>
          <Col md={3}>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={formData.first_name}
              placeholder="Nombre"
              name="first_name"
              onChange={handleDataChange}
            />
          </Col>

          <Col md={3}>
            <Form.Label>Apellidos</Form.Label>
            <Form.Control
              type="text"
              value={formData.last_name}
              placeholder="Apellidos"
              name="last_name"
              onChange={handleDataChange}
            />
          </Col>

          <Col md={3}>
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              value={formData.phone_number}
              placeholder="Teléfono"
              name="phone_number"
              onChange={handleDataChange}
            />
          </Col>

          <Col md={3}>
            <Form.Label>Descuento</Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={formData.discount}
              onChange={handleDataChange}
              name="discount"
            >
              <option value="">Selecciona un descuento</option>
              {discounts.map((discount) => (
                <option key={discount.id} value={discount.id}>
                  {discount.discount_percentage}%
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Label></Form.Label>
            <CustomButton
              fullWidth={true}
              onClick={handleCreateClient}
              disabled={isFormIncomplete()}
              marginTop="10px"
            >
              Crear cliente
            </CustomButton>
          </Col>
        </Row>
      </div>
      <div>
        <Row className="section">
          <Form.Label className="fw-bold">Lista de clientes</Form.Label>
          <CustomTable
            data={clients}
            columns={[
              {
                name: "#",
                selector: (row) => row.id,
              },
              {
                name: "Nombre",
                selector: (row) => row.full_name,
                grow: 2,
              },
              {
                name: "Telefono",
                selector: (row) => row.phone_number,
                grow: 2,
                wrap: true,
              },
              {
                name: "Descuento",
                selector: (row) => row.discount_percentage + "%",
              },
            ]}
          />
        </Row>
      </div>
    </>
  );
};

export default ClientList;
