import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { loginUser } from "../apis/login";
import { useNavigate } from "react-router-dom";

const suscriptionExpirationDate = process.env.REACT_APP_SUBSCRIPTION_EXPIRATION_DATE;

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
    canLogin: true,
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

  useEffect(() => {
    const expirationDate = new Date(suscriptionExpirationDate);
    const currentDate = new Date();
    setState((prevState) => ({
      ...prevState,
      canLogin: currentDate <= expirationDate,
    }));
  }, []);

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
    if (response.tipo_jurisdiccion) {
      navigate(
        `/${response.tipo_jurisdiccion.toLowerCase()}/${response.nombre_jurisdiccion.toLowerCase()}`
      );
    } else {
      navigate("/nueva-venta/");
    }
  };

  const { formData, alertData, canLogin } = state;

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
                  {canLogin ? (
                    <button
                      type="submit"
                      className="btn btn-success"
                      onClick={handleSubmit}
                    >
                      Iniciar sesión
                    </button>
                  ) : (
                    <span>
                      No puede iniciar sesión, póngase en contacto con su
                      proveedor.
                    </span>
                  )}
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
