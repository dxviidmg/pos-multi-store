import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Form, Row } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { removeClientfromCart } from "../redux/cart/cartActions";


const ClientSelected = () => {
  const client = useSelector((state) => state.cartReducer.client);
  const dispatch = useDispatch();

  const handleShortcut = (event) => {
    if (event.ctrlKey && event.key === "e") {
      event.preventDefault(); // Evita la acción predeterminada del navegador
      dispatch(removeClientfromCart())
    }
  };

  useEffect(() => {
    // Añadir el listener al montar el componente
    window.addEventListener("keydown", handleShortcut);

    // Limpiar el listener al desmontar el componente
    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  return (
    <Row className="align-items-end">
      <Col md={3}>
        <Form.Group>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={client.full_name ? client.full_name : ""}
            placeholder="Nombre"
            disabled
          />
        </Form.Group>
      </Col>

      <Col md={3}>
        <Form.Group>
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            value={client.phone_number ? client.phone_number : ""}
            placeholder="Teléfono"
            disabled
          />
        </Form.Group>
      </Col>

      <Col md={3}>
        <Form.Group>
          <Form.Label>Descuento</Form.Label>
          <Form.Control
            type="text"
            value={client.discount_percentage ? `${client.discount_percentage}%` : ""}
            placeholder="Descuento"
            disabled
          />
        </Form.Group>
      </Col>

      <Col md={3}>
        <Form.Group>
          <CustomButton fullWidth={true} onClick={() => dispatch(removeClientfromCart())}>
          Borrar 
          (Ctrl + E)
          </CustomButton>
        </Form.Group>
      </Col>
    </Row>
  );
};

export default ClientSelected;
