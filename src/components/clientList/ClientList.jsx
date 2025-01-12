import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { getClients } from "../apis/clients";
import { Col, Container, Form, Row } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { createDiscount } from "../apis/discounts";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import {
  hideClientModal,
  showClientModal,
} from "../redux/clientModal/ClientModalActions";
import ClientModal from "../clientModal/ClientModal";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [userType, setUserType] = useState(null);
  const dispatch = useDispatch();

  const [discountFormData, setDiscountFormData] = useState({
    discount_percentage: "",
  });

  // Load userType from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserType(user?.store === null ? "admin" : "");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsResponse] = await Promise.all([
          getClients(),
        ]);
        setClients(clientsResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleDiscountInputChange = (e) => {
    const { name, value } = e.target;
    setDiscountFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveDiscount = async () => {
    const response = await createDiscount(discountFormData);

    if (response.status === 201) {
      setDiscountFormData({ discount_percentage: "" });

      Swal.fire({
        icon: "success",
        title: "Descuento creado",
        timer: 5000,
      });
    }
    else{
      handleDiscountError(response);
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
        discountError ===
        "discount with this discount percentage already exists."
      ) {
        message = "El descuento ya existe";
      }
    }

    Swal.fire({
      icon: "error",
      title: "Error al crear descuento",
      text: message,
      timer: 5000,
    });
  };

  const handleOpenModal = (client) => {
    dispatch(hideClientModal());
    setTimeout(() => dispatch(showClientModal(client)));
  };

  const handleUpdateClientList = (updatedClient) => {
    setClients((prevClients) => {
      const clientExists = prevClients.some((b) => b.id === updatedClient.id);
      return clientExists
        ? prevClients.map((b) =>
            b.id === updatedClient.id ? updatedClient : b
          )
        : [...prevClients, updatedClient];
    });
  };

  return (
    <Container fluid>
      <ClientModal onUpdateClientList={handleUpdateClientList}></ClientModal>
      <Row>
        {userType === "admin" && (
          <Col md={12}>
            <Row className="section">
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
        <Col>
          <Form.Label className="fw-bold">Lista de clientes</Form.Label>
          <br></br>
          <CustomButton onClick={() => handleOpenModal()}>Crear</CustomButton>

          <CustomTable
            searcher={true}
            data={clients}
            columns={[
              { name: "#", selector: (row) => row.id },
              { name: "Nombre", selector: (row) => row.full_name, grow: 2 },
              {
                name: "Teléfono",
                selector: (row) => row.phone_number,
                grow: 2,
              },
              {
                name: "Descuento",
                selector: (row) => `${row.discount_percentage}%`,
              },

              {
                name: "Accciones",
                cell: (row) => (
                  <CustomButton onClick={() => handleOpenModal(row)}>
                    Editar
                  </CustomButton>
                ),
              },
            ]}
            highlightOnHover
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ClientList;
