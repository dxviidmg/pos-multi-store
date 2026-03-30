import React, { useState, useEffect } from "react";
import { loginUser } from "../../../api/login";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../ui/Button/Button";
import Logo from "../../../assets/images/logo.jpg";
import BgImage from "../../../assets/images/bg.webp";
import './Login.css';
import {
  TextField, Box, Alert, Paper, Stack, Typography,
  IconButton, InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [state, setState] = useState({
    formData: { username: "", password: "" },
    alertData: { shown: false, message: "" },
    showPassword: false,
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, formData: { ...prev.formData, [name]: value } }));
  };

  const showAlert = (message) => {
    setState((prev) => ({ ...prev, alertData: { shown: true, message } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(state.formData);
      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));
        if (response.data.role === "owner") navigate("/tiendas/");
        else navigate("/vender/");
        onLogin();
      } else {
        showAlert("Usuario o contraseña incorrecta");
      }
    } catch (error) {
      showAlert(error.response?.status === 400
        ? "Usuario o contraseña incorrecta"
        : "Error desconocido, intente nuevamente.");
    }
  };

  const { formData, alertData, showPassword } = state;

  return (
    <Box sx={{
      minHeight: '100vh', height: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      backgroundImage: `url(${BgImage})`, backgroundSize: 'cover',
      backgroundPosition: 'center', position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
    }}>
      <Box sx={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(4,52,107,0.85) 0%, rgba(6,90,158,0.75) 100%)',
        backdropFilter: 'blur(2px)',
      }} />

      <Paper elevation={0} sx={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 400, borderRadius: 1, overflow: 'hidden',
        background: 'rgba(4,52,107,0.95)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
      }}>
        <Box sx={{ textAlign: 'center', pt: 5, pb: 2, px: 4 }}>
          <Box component="img" src={Logo} alt="SmartVenta" sx={{
            maxWidth: '160px', height: 'auto', mb: 3, borderRadius: 0,
            boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
          }} />
          <Typography variant="h4" sx={{
            fontWeight: 800, color: 'white', mb: 0.5, letterSpacing: '-0.02em',
          }}>
            Bienvenido
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            Ingrese sus credenciales para continuar
          </Typography>
        </Box>

        <Box sx={{ px: 4, pb: 5, pt: 2 }}>
          {alertData.shown && (
            <Alert severity="error" sx={{
              mb: 2.5, borderRadius: 1,
              backgroundColor: 'rgba(167,139,250,0.15)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(167,139,250,0.3)',
              '& .MuiAlert-icon': { color: 'accent' },
            }}>
              {alertData.message}
            </Alert>
          )}

          <Stack component="form" spacing={2.5}>
            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mb: 1, fontWeight: 600 }}>
                Usuario
              </Typography>
              <TextField fullWidth name="username" placeholder="Ingrese su usuario"
                value={formData.username} onChange={handleChange}
                required autoFocus autoComplete="username" size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.95)',
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: 'rgba(4,52,107,0.3)' },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mb: 1, fontWeight: 600 }}>
                Contraseña
              </Typography>
              <TextField fullWidth name="password" placeholder="Ingrese su contraseña"
                type={showPassword ? "text" : "password"}
                value={formData.password} onChange={handleChange}
                required autoComplete="current-password" size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small"
                        onClick={() => setState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                        sx={{ color: 'primary' }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.95)',
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: 'rgba(4,52,107,0.3)' },
                  },
                }}
              />
            </Box>

            <CustomButton onClick={handleSubmit} fullWidth
              sx={{
                py: 1.3, mt: 1, borderRadius: 1, fontWeight: 700, fontSize: '0.95rem',
                background: 'linear-gradient(135deg, #a78bfa 0%, #7c5cbf 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c5cbf 0%, #6344a3 100%)',
                  boxShadow: '0 6px 20px rgba(167,139,250,0.4)',
                },
              }}
            >
              Iniciar Sesión
            </CustomButton>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
