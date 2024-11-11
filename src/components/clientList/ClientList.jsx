import React, { useEffect, useState, useCallback } from "react";
import CustomTable from "../commons/customTable/customTable";
import { createClient, getClients } from "../apis/clients";
import { Col, Form, Row } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { createDiscount, getDiscounts } from "../apis/discounts";
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

  const [formData2, setFormData2] = useState({
    discount_percentage: "",
  });

  const isFormIncomplete = useCallback(
    () => Object.values(formData).some((value) => value === ""),
    [formData]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsResponse, discountsResponse] = await Promise.all([
          getClients(),
          getDiscounts(),
        ]);
        setClients(clientsResponse.data);
        setDiscounts(discountsResponse.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al cargar datos",
          text: "No se pudo cargar la lista de clientes o descuentos.",
        });
      }
    };

    fetchData();
  }, []);

  const handleDataChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "discount" ? parseInt(value) : value,
    }));
  }, []);

  const handleData2Change = useCallback((e) => {
    const { name, value } = e.target;
    setFormData2((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleCreateClient = async () => {
    try {
      const response = await createClient(formData);

      if (response.status === 201) {
        setClients((prevClients) => [...prevClients, response.data]);
        Swal.fire({
          icon: "success",
          title: "Cliente creado",
          timer: 2000,
        });
      } else {
        throw response;
      }
    } catch (error) {
      let text = "Error desconocido";

      if (error.response?.data?.phone_number) {
        const errorMsg = error.response.data.phone_number[0];
        if (errorMsg === "Ensure this field has at least 10 characters.") {
          text = "El teléfono debe tener 10 dígitos.";
        } else if (errorMsg === "client with this phone number already exists.") {
          text = "El teléfono ya existe.";
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error al crear cliente",
        timer: 2000,
        text,
      });
    }
  };

  const handleCreateDiscount = async () => {
    try {
      const response = await createDiscount(formData2);

      if (response.status === 201) {
        setDiscounts((prevDiscounts) => {
          const updatedDiscounts = [...prevDiscounts, response.data];
          updatedDiscounts.sort((a, b) => a.discount_percentage - b.discount_percentage);
          return updatedDiscounts;
        });
        Swal.fire({
          icon: "success",
          title: "Descuento creado",
          timer: 2000,
        });
      } else {
        throw response;
      }
    } catch (error) {
      let text = "Error desconocido";

      if (error.response?.data?.discount_percentage) {
        if (error.response.data.discount_percentage[0] === "discount with this discount percentage already exists.") {
          text = "El descuento ya existe.";
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error al crear descuento",
        timer: 2000,
        text,
      });
    }
  };

  return (
    <>
      <div>
        <Row>
          <Col md={9}>
            <Row className="section-left">
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
                  onClick={handleCreateClient}
                  disabled={isFormIncomplete()}
                  marginTop="10px"
                >
                  Crear cliente
                </CustomButton>
              </Col>
            </Row>
          </Col>
          <Col md={3}>
            <Row className="section-right">
              <Form.Label className="fw-bold">Crear descuento</Form.Label>
              <Col md={12}>
                <Form.Label>Descuento</Form.Label>
                <Form.Control
                  type="number"
                  value={formData2.discount_percentage}
                  placeholder="Descuento"
                  name="discount_percentage"
                  onChange={handleData2Change}
                />
                <CustomButton
                  fullWidth
                  onClick={handleCreateDiscount}
                  disabled={formData2.discount_percentage === ""}
                  marginTop="10px"
                >
                  Crear descuento
                </CustomButton>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div>
        <Row className="section">
          <Form.Label className="fw-bold">Lista de clientes</Form.Label>
          <CustomTable
            data={clients}
            columns={[
              { name: "#", selector: (row) => row.id },
              { name: "Nombre", selector: (row) => row.full_name, grow: 2 },
              { name: "Teléfono", selector: (row) => row.phone_number, grow: 2, wrap: true },
              { name: "Descuento", selector: (row) => `${row.discount_percentage}%` },
            ]}
          />
        </Row>
      </div>
    </>
  );
};

export default ClientList;
