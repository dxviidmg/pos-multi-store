import React, { useState } from "react";
import { loginUser } from "../../../api/login";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../ui/Button/Button";
import Logo from "../../../assets/images/logo.jpg";
import './login.css';
import { TextField, Box, Alert, Paper, Stack, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { colors } from "../../../theme/colors";


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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: '#f5f5f5',
      }}
    >
      {/* Panel izquierdo - Branding */}
      <Box
        sx={{
          flex: 1,
          background: `linear-gradient(180deg, ${colors.primary} 0%, #052a52 100%)`,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 6,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.4,
          }
        }}
      >
        <Box
          component="img"
          src={Logo}
          alt="SmartVenta"
          sx={{
            maxWidth: '320px',
            width: '80%',
            height: 'auto',
            borderRadius: 2,
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            mb: 4,
            position: 'relative',
            zIndex: 1,
          }}
        />
        <Typography
          variant="h4"
          sx={{
            color: 'white',
            fontWeight: 300,
            textAlign: 'center',
            mb: 2,
            position: 'relative',
            zIndex: 1,
          }}
        >
          SmartVenta
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            maxWidth: '400px',
            lineHeight: 1.8,
            position: 'relative',
            zIndex: 1,
          }}
        >
          Sistema integral de punto de venta para la gestión eficiente de tu negocio
        </Typography>
      </Box>

      {/* Panel derecho - Formulario */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
          backgroundColor: 'white',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: colors.primary,
                mb: 1,
              }}
            >
              Iniciar Sesión
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
            >
              Ingrese sus credenciales para acceder al sistema
            </Typography>
          </Box>

          {alertData.shown && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 1,
              }}
            >
              {alertData.message}
            </Alert>
          )}

          <Stack component="form" spacing={3}>
            <TextField
              fullWidth
              label="Usuario"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoFocus
              variant="outlined"
              InputLabelProps={{
                sx: { fontWeight: 500 }
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              variant="outlined"
              InputLabelProps={{
                sx: { fontWeight: 500 }
              }}
            />

            <CustomButton
              onClick={handleSubmit}
              fullWidth
              startIcon={<LoginIcon />}
              sx={{ 
                mt: 2, 
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Acceder
            </CustomButton>
          </Stack>

          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
              © {new Date().getFullYear()} SmartVenta. Todos los derechos reservados.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
