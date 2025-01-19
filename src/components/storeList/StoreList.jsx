import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Col, Container, Form, Row } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { getStores } from "../apis/stores";

const StoreList = () => {
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getStores();
      console.log(response)
      setStores(response.data);
      setLoading(false);
    };

    fetchData();
  }, []);

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
                    <CustomButton>
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
