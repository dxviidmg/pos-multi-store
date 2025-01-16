import React, { useState } from "react";
import { Container, Row, Col, Alert, Image, Form } from "react-bootstrap";
import { loginUser } from "../apis/login";
import { useNavigate } from "react-router-dom";
import CustomButton from "../commons/customButton/CustomButton";
import Logo from "../../assets/images/Logo.png";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [state, setState] = useState({
    formData: {
      username: "",
      password: "",
    },
    alertData: {
      shown: false,
      message: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));
  };

  const showAlert = (message) => {
    setState((prevState) => ({
      ...prevState,
      alertData: {
        shown: true,
        message,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { formData } = state;

    try {
      const response = await loginUser(formData);
      localStorage.setItem("user", JSON.stringify(response));

      if ("user_id" in response) {
        onLogin(response);
        handleRedirect(response);
      } else {
        showAlert("Usuario o contraseña incorrecta");
      }
    } catch (error) {
      handleLoginError(error);
    }
  };

  const handleLoginError = (error) => {
    if (error.response && error.response.status === 400) {
      showAlert("Usuario o contraseña incorrecta");
    } else {
      showAlert("Error desconocido, intente nuevamente.");
    }
  };

  const handleRedirect = (response) => {
    if (response.store_name) {
      navigate("/vender/");
    } else {
      navigate("/productos/");
    }
  };

  const { formData, alertData } = state;

  return (
    <div id="login">
      <Container style={{ height: "100vh" }}>
        <Row className="h-100 d-flex align-items-center justify-content-center">
          <Col
            sx={10}
            md={6}
            lg={4}
            id="login-col"
            className="align-items-center rounded"
            style={{
              backgroundColor: "#253C47",
              padding: "30px",
              border: "1px solid",
              color: 'white'
            }}
          >
            <Image width="100%" src={Logo} rounded></Image>

            {alertData.shown && (
              <Alert variant="danger" className="mt-3">
                {alertData.message}
              </Alert>
            )}

            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control mt-1"
                  placeholder="Usuario"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label >Password</Form.Label>
                <Form.Control
                  type="password"
                  className="form-control mt-1"
                  placeholder="Contraseña"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <CustomButton onClick={handleSubmit} fullWidth>
                Iniciar sesión
              </CustomButton>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
