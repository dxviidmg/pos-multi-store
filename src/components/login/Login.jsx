import React, { useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { loginUser } from "../apis/login";
import { useNavigate } from "react-router-dom";
import CustomButton from "../commons/customButton/CustomButton";


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
    console.log('responsito', response)
    if (response.store) {
      navigate("/nueva-venta/");
    } else {
      navigate("/productos/");
    }
  };

  const { formData, alertData } = state;

  return (
    <div id="login">
      <Container>
        <Row className="justify-content-center">
          <Col
            md={6}
            lg={3}
            id="login-col"
            className="d-flex align-items-center"
          >
            <form className="Auth-form">
              <div className="Auth-form-content">
                <h3 className="Auth-form-title text-center">Iniciar sesión</h3>
                <div className="form-group mt-3">
                  <label>Usuario</label>
                  <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="Usuario"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    className="form-control mt-1"
                    placeholder="Contraseña"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-grid gap-2 mt-3">
                  

                    <CustomButton onClick={handleSubmit}>Iniciar sesión</CustomButton>
                  
                </div>
                {alertData.shown && (
                  <Alert variant="danger" className="mt-3">
                    {alertData.message}
                  </Alert>
                )}
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
