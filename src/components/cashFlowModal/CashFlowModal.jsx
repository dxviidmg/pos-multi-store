import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import Swal from "sweetalert2";
import { hideCashFlowModal } from "../redux/cashFlowModal/CashFlowModalActions";
import { createCashFlow, getCashFlowChoices } from "../apis/cashflow";


const CashFlowModal = ({ onUpdateCashFlowList }) => {
  const { showCashFlowModal, cashFlow } = useSelector(
    (state) => state.CashFlowModalReducer
  );

  const [formData, setFormData] = useState({id: ""
  });

  const [options, setOptions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCashFlowChoices();
      console.log(data)
      setOptions(data.data);
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    console.log('e2')
    if (cashFlow) {
      setFormData({
        id: cashFlow.id || "",
        name: cashFlow.name || "",
      });
    }
  }, [cashFlow]);

  const dispatch = useDispatch();

  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBrandSubmit = async () => {
    let response;
    if (formData.id) {
//      response = await updateBrand(formData);
    } else {
      response = await createCashFlow(formData);
    }

    onUpdateCashFlowList(response.data);
    if (response.status === 200) {
      dispatch(hideCashFlowModal());
      setFormData({});
      Swal.fire({
        icon: "success",
        title: "Mov actualizada",
        timer: 5000,
      });
    } else if (response.status === 201) {
      dispatch(hideCashFlowModal());
      setFormData({});
      Swal.fire({
        icon: "success",
        title: "Movimiento creado",
        timer: 5000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al crear la marca",
        timer: 5000,
        text: "Error desconocido, por favor comuniquese con soporte",
      });
    }
  };

  return (
    <CustomModal showOut={showCashFlowModal} title={formData.id ? "Actualizar movimiento" : "Crear movimiento"}>
      <Row>
        <Col md={3}>
        <Form.Label>Tipo de movimiento</Form.Label>
        <Form.Select
              value={formData.transaction_type}
              onChange={handleDataChange}
              name="transaction_type"
//              disabled={isLoading}
            >

              <option value="">Selecciona</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label>Concepto</Form.Label>
          <Form.Control
            type="text"
            value={formData.concept}
            placeholder="Concepto"
            name="concept"
            onChange={handleDataChange}
          />
        </Col>
        <Col md={3}>
          <Form.Label>Cantidad</Form.Label>
          <Form.Control
            type="number"
            value={formData.amount}
            placeholder="Cantidad"
            name="amount"
            onChange={handleDataChange}
          />
        </Col>
        <Col md={3} className="d-flex flex-column justify-content-end">
          <CustomButton
            fullWidth={true}
            onClick={handleBrandSubmit}
//            disabled={formData.name === ""}
            marginTop="3px"
          >
            {formData.id ? "Actualizar" : "Crear"}
          </CustomButton>
        </Col>
      </Row>
    </CustomModal>
  );
};

export default CashFlowModal;
