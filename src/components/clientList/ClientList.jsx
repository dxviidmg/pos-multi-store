import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { createClient, getClients } from "../apis/clients";
import { Col, Container, Form, Row } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { createDiscount, getDiscounts } from "../apis/discounts";
import Swal from "sweetalert2";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    discount: "",
  });

  const [formData2, setFormData2] = useState({
    discount_percentage: "",
  });

  // Cargar el userType desde localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    if (user.store === null) {
      setUserType("admin");
    } else {
      setUserType("");
    }
  }, []);

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
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleData2Change = async (e) => {
    let { name, value } = e.target;

    setFormData2((prevData) => ({ ...prevData, [name]: value }));
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
          text = "El teléfono debe tener 10 dígitos";
        }
        if (
          response.response.data.phone_number[0] ===
          "client with this phone number already exists."
        ) {
          text = "El teléfono ya existe";
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
        text: "Error desconocido, por favor comuníquese con soporte",
      });
    }
  };

  const handleCreateDiscount = async (e) => {
    const response = await createDiscount(formData2);

    if (response.status === 201) {
      setDiscounts((prevDiscounts) => {
        const updatedDiscounts = [...prevDiscounts, response.data];
        updatedDiscounts.sort(
          (a, b) => a.discount_percentage - b.discount_percentage
        );
        return updatedDiscounts;
      });
      setFormData2({ discount_percentage: "" });
      Swal.fire({
        icon: "success",
        title: "Descuento creado",
        timer: 2000,
      });
    } else if (response.status === 400) {
      let text = "Error desconocido";
      if (response.response.data.discount_percentage) {
        if (
          response.response.data.discount_percentage[0] ===
          "discount with this discount percentage already exists."
        ) {
          text = "El descuento ya existe";
        }
      }
      Swal.fire({
        icon: "error",
        title: "Error al crear descuento",
        timer: 2000,
        text: text,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al crear descuento",
        timer: 2000,
        text: "Error desconocido, por favor comuníquese con soporte",
      });
    }
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
            fullWidth={true}
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
        
        


        {userType === "admin" && (
        <Row className="section-right">

          <Form>
          <Form.Label className="fw-bold">Crear descuento</Form.Label>
          <br></br>
            <Form.Label>Descuento</Form.Label>
            <Form.Control
              type="number"
              value={formData2.discount_percentage}
              placeholder="Descuento"
              name="discount_percentage"
              onChange={handleData2Change}
            />

            <CustomButton
              fullWidth={true}
              onClick={handleCreateDiscount}
              disabled={formData2.discount_percentage === ""}
              marginTop="10px"
            >
              Crear descuento
            </CustomButton>
          </Form>
        </Row>
      )}





        
        </Col>
      </Row>




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
              name: "Teléfono",
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
    </Container>
  );
};

export default ClientList;
