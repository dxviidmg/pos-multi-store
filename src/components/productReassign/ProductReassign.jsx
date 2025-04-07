import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";
import { getBrands } from "../apis/brands";
import Swal from "sweetalert2";
import { getDepartments } from "../apis/departments";
import CustomButton from "../commons/customButton/CustomButton";
import { reassignProducts } from "../apis/products";

const REASSIGN_TYPE = [
  {
    value: "brand",
    label: "Marca",
  },
  {
    value: "department",
    label: "Departamento",
  },
]

const INITIAL_FORM_DATA =  {reassign_type: "", origin_id: "", destination_id: ""}
const ProductReassign = () => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [params, setParams] = useState(INITIAL_FORM_DATA);



  useEffect(() => {
    const fetchStoreProducts = async () => {
      console.log('params.reassign_type', params.reassign_type)
      setLoading(true);
      if (params.reassign_type === "department"){
        const departments = await getDepartments()
        console.log(departments)
        setOptions(departments.data)
      }
      else if (params.reassign_type === "brand"){
        const departments = await getBrands()
        console.log(departments)
        setOptions(departments.data)
      }
      else {
        setOptions([])
      }
      setLoading(false);
    };

    fetchStoreProducts();
  }, [params.reassign_type]);




  const handleReassignProducts = async () => {


    const response = await reassignProducts(params);

    console.log(response);
    if (response.status === 200) {
      setParams(INITIAL_FORM_DATA)
      Swal.fire({
        icon: "success",
        title: "Productos reasignados",
        timer: 5000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al reasignar Productos",
        timer: 5000,
      });
    }
  };





  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    console.log(name, value);
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };


  return (
    <div className="custom-section">
      <CustomSpinner2 isLoading={loading}></CustomSpinner2>
      <Form.Label className="fw-bold">Reasignación de productos</Form.Label>



      <Row className="mt-3">

      <Col>
          {" "}
          <Form.Label>Tipo de reasignación</Form.Label>
          <Form.Select
            value={params.reassign_type}
            onChange={handleDataChange}
            name="reassign_type"
            //              disabled={isLoading}
          >
            <option value="">Selecciona</option>
            {REASSIGN_TYPE.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col>
          {" "}
          <Form.Label>Origen</Form.Label>
          <Form.Select
            value={options.origin_id}
            onChange={handleDataChange}
            name="origin_id"
            //              disabled={isLoading}
          >
            <option value="">Origen</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} ({option.product_count})
              </option>
            ))}
          </Form.Select>
        </Col>


        <Col>
          {" "}
          <Form.Label>Destino</Form.Label>
          <Form.Select
            value={options.destination_id}
            onChange={handleDataChange}
            name="destination_id"
            //              disabled={isLoading}
          >
            <option value="">Destino</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} ({option.product_count})
              </option>
            ))}
          </Form.Select>
        </Col>
            <Col className="d-flex flex-column justify-content-end">
            <CustomButton fullWidth={true}
            disabled={Object.values(params).some(
              (value) => value === ""
            ) || params.origin_id === params.destination_id} onClick={handleReassignProducts}
            >Reasignar</CustomButton>
            </Col>
      </Row>
    </div>
  );
};

export default ProductReassign;
