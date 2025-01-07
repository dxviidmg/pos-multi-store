import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { createClient, getClients, updateClient } from "../apis/clients";
import { Col, Container, Form, Row } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { createDiscount, getDiscounts } from "../apis/discounts";
import Swal from "sweetalert2";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [userType, setUserType] = useState(null);
  const [clientFormData, setClientFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    discount: "",
  });

  const [discountFormData, setDiscountFormData] = useState({
    discount_percentage: "",
  });

  // Load userType from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserType(user?.store === null ? "admin" : "");
  }, []);

  const isClientFormIncomplete = () => {
    return Object.values(clientFormData).some((value) => value === "");
  };

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
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleClientInputChange = (e) => {
    const { name, value } = e.target;
    setClientFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDiscountInputChange = (e) => {
    const { name, value } = e.target;
    setDiscountFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveClient = async () => {
    try {
      const response = clientFormData.id
        ? await updateClient(clientFormData)
        : await createClient(clientFormData);

      if (response.status === 200 || response.status === 201) {
        const updatedClients = clientFormData.id
          ? clients.map((client) =>
              client.id === response.data.id ? response.data : client
            )
          : [...clients, response.data];

        setClients(updatedClients);
        setClientFormData({
          first_name: "",
          last_name: "",
          phone_number: "",
          discount: "",
        });

        Swal.fire({
          icon: "success",
          title: `Cliente ${clientFormData.id ? "actualizado" : "creado"}`,
          timer: 2000,
        });
      }
    } catch (error) {
      handleClientError(error);
    }
  };

  const handleClientError = (error) => {
    let message = "Error desconocido, por favor comuníquese con soporte";

    if (error.response?.status === 400 && error.response.data.phone_number) {
      const phoneError = error.response.data.phone_number[0];
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

  const handleSaveDiscount = async () => {
    try {
      const response = await createDiscount(discountFormData);

      if (response.status === 201) {
        setDiscounts((prevDiscounts) => {
          const updatedDiscounts = [...prevDiscounts, response.data].sort(
            (a, b) => a.discount_percentage - b.discount_percentage
          );
          return updatedDiscounts;
        });
        setDiscountFormData({ discount_percentage: "" });

        Swal.fire({
          icon: "success",
          title: "Descuento creado",
          timer: 2000,
        });
      }
    } catch (error) {
      handleDiscountError(error);
    }
  };

  const handleDiscountError = (error) => {
    let message = "Error desconocido, por favor comuníquese con soporte";

    if (
      error.response?.status === 400 &&
      error.response.data.discount_percentage
    ) {
      const discountError = error.response.data.discount_percentage[0];
      if (
        discountError === "discount with this discount percentage already exists."
      ) {
        message = "El descuento ya existe";
      }
    }

    Swal.fire({
      icon: "error",
      title: "Error al crear descuento",
      text: message,
      timer: 2000,
    });
  };

  return (
    <Container fluid>
      <Row>
        <Col md={userType === "admin" ? 9 : 12}>
          <Row className={`section${userType === "admin" ? "-left" : ""}`}>
            <Form.Label className="fw-bold">Crear cliente</Form.Label>
            <Col>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={clientFormData.first_name}
                placeholder="Nombre"
                name="first_name"
                onChange={handleClientInputChange}
              />
            </Col>
            <Col md={3}>
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                value={clientFormData.last_name}
                placeholder="Apellidos"
                name="last_name"
                onChange={handleClientInputChange}
              />
            </Col>
            <Col md={3}>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                value={clientFormData.phone_number}
                placeholder="Teléfono"
                name="phone_number"
                onChange={handleClientInputChange}
              />
            </Col>
            <Col md={3}>
              <Form.Label>Descuento</Form.Label>
              <Form.Select
                aria-label="Select discount"
                value={clientFormData.discount}
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
                {clientFormData.id ? "Actualizar" : "Crear"} cliente
              </CustomButton>
            </Col>
          </Row>
        </Col>
        {userType === "admin" && (
          <Col md={3}>
            <Row className="section-right">
              <Form>
                <Form.Label className="fw-bold">Crear descuento</Form.Label>
                <br></br>
                <Form.Label>Descuento</Form.Label>
                <Form.Control
                  type="number"
                  value={discountFormData.discount_percentage}
                  placeholder="Descuento"
                  name="discount_percentage"
                  onChange={handleDiscountInputChange}
                />
                <CustomButton
                  fullWidth
                  onClick={handleSaveDiscount}
                  disabled={!discountFormData.discount_percentage}
                  marginTop="10px"
                >
                  Crear descuento
                </CustomButton>
              </Form>
            </Row>
          </Col>
        )}
      </Row>
      <Row className="section">
        <Form.Label className="fw-bold">Lista de clientes</Form.Label>
        <CustomTable
          searcher={true}
          data={clients}
          columns={[
            { name: "#", selector: (row) => row.id },
            { name: "Nombre", selector: (row) => row.full_name, grow: 2 },
            { name: "Teléfono", selector: (row) => row.phone_number, grow: 2 },
            { name: "Descuento", selector: (row) => `${row.discount_percentage}%` },
          ]}
          highlightOnHover
        />
      </Row>
    </Container>
  );
};

export default ClientList;
