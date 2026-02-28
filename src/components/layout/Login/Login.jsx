import React, { useState } from "react";
import { loginUser } from "../../../api/login";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../ui/Button/Button";
import Logo from "../../../assets/images/logo.jpg";
import './login.css';
import { Grid, TextField, Box, Alert, Container } from "@mui/material";
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
    <Box id="login" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: "#04356b",
            padding: 4,
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white'
          }}
        >
          <Box
            component="img"
            src={Logo}
            alt="Logo"
            sx={{
              width: '100%',
              borderRadius: 2,
              mb: 2
            }}
          />

          {alertData.shown && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {alertData.message}
            </Alert>
          )}

          <Box component="form">
            <TextField
              size="small"
              fullWidth
              label="Usuario"
              type="text"
              placeholder="Usuario"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              sx={{ mb: 2, backgroundColor: 'white', borderRadius: 1 }}
            />

            <TextField
              size="small"
              fullWidth
              label="Contraseña"
              type="password"
              placeholder="Contraseña"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 2, backgroundColor: 'white', borderRadius: 1 }}
            />

            <CustomButton onClick={handleSubmit} fullWidth startIcon={<LoginIcon />}>
              Iniciar sesión
            </CustomButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;
