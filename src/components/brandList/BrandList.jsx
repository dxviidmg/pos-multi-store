import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Col, Container, Form, Row } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import Swal from "sweetalert2";
import { createBrand, getBrands, updateBrand } from "../apis/brands";

const BrandList = () => {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
  });


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const response = await getBrands();
      setBrands(response.data);
      setLoading(false)
    };

    fetchData();
  }, []);

  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

  };

  const handleBrandSubmit = async () => {

    let response
    if (formData.id){
      response = await updateBrand(formData);
    }
    else{
      response = await createBrand(formData);
    }
    if (response.status === 200) {
      setBrands((prevProducts) =>
        prevProducts.map((product) =>
          product.id === response.data.id ? response.data : product
        )
      );
      
      setFormData(
        {
          name: ""
        }
      )
      Swal.fire({
        icon: "success",
        title: "Marca actualizada",
        timer: 2000,
      });
    }
    else if (response.status === 201) {
      setBrands((prevproducts) => [...prevproducts, response.data]);

      Swal.fire({
        icon: "success",
        title: "Marca creada",
        timer: 2000,
      });
    }

    else if (response.status === 400) {
      let text = "Error desconocido";
      if (response.response.data.code) {
        if (
          response.response.data.code[0] ===
          "product with this code already exists."
        ) {
          text = "El codigo ya existe";
        }
      }
      Swal.fire({
        icon: "error",
        title: "Error al crear producto",
        timer: 2000,
        text: text,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al crear producto",
        timer: 2000,
        text: "Error desconocido, por favor comuniquese con soporte",
      });
    }
  };

  return (
    <Container fluid>
      <div>
        <Row className="section">
          <Form.Label className="fw-bold">Crear marca</Form.Label>
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



          <Col md={6}>
            <Form.Label>.</Form.Label>
            <CustomButton
              fullWidth={true}
              onClick={handleBrandSubmit}
              disabled={formData.name === ""}
              marginTop="3px"
            >
              {formData.id ? 'Actualizar': 'Crear'} producto
            </CustomButton>
          </Col>
        </Row>
      </div>
      <div>
        <Row className="section">
          <Form.Label className="fw-bold">Lista de marcas</Form.Label>
          <CustomTable
            progressPending={loading}
            data={brands}
            columns={[
              {
                name: "Nombre",
                selector: (row) => row.name,
                grow: 2,
                wrap: true
              },
              {
                name: "Accciones",
                cell: (row) => (
                  <CustomButton onClick={() => setFormData(row)}>
                    Editar
                  </CustomButton>
                ),
              },
            ]}
          />
        </Row>
      </div>
    </Container>
  );
};

export default BrandList;
