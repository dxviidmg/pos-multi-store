import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Col, Container, Form, Row } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { getBrands } from "../apis/brands";
import BrandModal from "../brandModal/BrandModal";
import { useDispatch } from "react-redux";
import {
  hideBrandModal,
  showBrandModal,
} from "../redux/brandModal/BrandModalActions";

const BrandList = () => {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getBrands();
      setBrands(response.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleOpenModal = (brand) => {
    dispatch(hideBrandModal());
    setTimeout(() => dispatch(showBrandModal(brand)));
  };

  const handleUpdateBrandList = (updatedBrand) => {
    setBrands((prevBrands) => {
      const brandExists = prevBrands.some((b) => b.id === updatedBrand.id);
      return brandExists
        ? prevBrands.map((b) => (b.id === updatedBrand.id ? updatedBrand : b))
        : [...prevBrands, updatedBrand];
    });
  };

  return (
    <Container fluid>
      <BrandModal onUpdateBrandList={handleUpdateBrandList}></BrandModal>
        <Row className="section">
          <Col md={12}>
            {" "}
            <Form.Label className="fw-bold">Lista de marcas</Form.Label>
            <br></br>
            <CustomButton onClick={() => handleOpenModal()}>Crear</CustomButton>
          </Col>

          <Col md={12}>
            <CustomTable
              progressPending={loading}
              data={brands}
              columns={[
                {
                  name: "Nombre",
                  selector: (row) => row.name,
                  grow: 2,
                  wrap: true,
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
            />
          </Col>
        </Row>
    </Container>
  );
};

export default BrandList;
