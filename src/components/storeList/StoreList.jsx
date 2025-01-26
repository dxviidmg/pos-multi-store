import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Col, Container, Form, Row } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { getStores } from "../apis/stores";
import { useNavigate } from "react-router-dom";

const StoreList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getStores();
      setStores(response.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSelectStore = async (row) => {
    const user = JSON.parse(localStorage.getItem("user"));
    user.store_type = row.store_type;
    user.store_name = row.full_name;
    user.store_id = row.id;

    const updatedData = JSON.stringify(user);
    
    // Save the updated string back to localStorage
    localStorage.setItem('user', updatedData);

    navigate("/vender/")
    window.location.reload();

  };

  return (
    <Container fluid>
        <Row className="section">
          <Col md={12}>
            {" "}
            <Form.Label className="fw-bold">Lista de tiendas</Form.Label>
          </Col>

          <Col md={12}>
            <CustomTable
              progressPending={loading}
              data={stores}
              columns={[
                {
                  name: "Nombre",
                  selector: (row) => row.name,
                },

                {
                  name: "Tipo",
                  selector: (row) => row.store_type_display,
                },
                {
                  name: "Accciones",
                  cell: (row) => (
                    <CustomButton onClick={()=> handleSelectStore(row)}>
                      Entrar
                    </CustomButton>
                  ),
                },
              ]}
            />
          </Col>
        </Row>
    </Container>
  );
};

export default StoreList;
