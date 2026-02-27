import React, { useState } from "react";
import { Container, Alert, Image, FormLabel } from "react-bootstrap";
import { loginUser } from "../../api/login";
import { useNavigate } from "react-router-dom";
import CustomButton from "../commons/customButton/CustomButton";
import Logo from "../../assets/images/logo.jpg";
import './login.css'
import { Grid, TextField, Box } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";


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

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));

        handleRedirect(response.data);
        onLogin();
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

  const handleRedirect = (user) => {
    if (user.role === "owner") {
      navigate("/tiendas/");
    } else {
      navigate("/vender/");
    }
  };

  const { formData, alertData } = state;

  return (
    <div id="login">
      <Container style={{ height: "99.7vh" }}>
        <Grid container spacing={2} className="h-100 d-flex align-items-center justify-content-center">
          <Grid item xs={12} md={6} lg={4}
            sx={10}
            id="login-col"
            className="align-items-center rounded"
            style={{
              backgroundColor: "#04356b",
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

            <Box component="form" className='mt-4'>
              <Box className="mb-2" controlId="formBasicEmail">
                <TextField size="small" fullWidth label="Usuario" type="text"
                  className="form-control mt-1"
                  placeholder="Usuario"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Box>

              <Box className="mb-2" controlId="formBasicPassword">
                <FormLabel >Contraseña</FormLabel>
                <TextField size="small" fullWidth type="password"
                  className="form-control mt-1"
                  placeholder="Contraseña"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Box>
              <CustomButton onClick={handleSubmit} fullWidth startIcon={<LoginIcon />}>
                Iniciar sesión
              </CustomButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Login;
