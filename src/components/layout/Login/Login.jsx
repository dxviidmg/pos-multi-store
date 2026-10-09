import React, { useState, useEffect } from "react";
import { loginUser } from "../../../api/login";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import LogoWhite from "../../../assets/images/logo-white.svg";
import LogoBlue from "../../../assets/images/logo-blue.svg";
import { colors } from "../../../theme/colors";
import { isOwner } from "../../../constants/routeAccess";
import { alpha } from "@mui/material/styles";
import {
  TextField, Box, Alert, Paper, Stack, Typography,
  IconButton, InputAdornment, Button,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";

function Login() {
  const navigate = useNavigate();
  const { login } = useUser();
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
      const { data } = await loginUser(state.formData);
      login(data);
      if (data.access_blocked) {
        // Negocio vencido: el dueño entra solo para renovar/pagar
        navigate("/mi-plan-actual/");
      } else if (isOwner(data)) {
        navigate("/tiendas/");
      } else {
        navigate("/vender/");
      }
    } catch (error) {
      const status = error.response?.status;
      const code = error.response?.data?.code;
      if (status === 403 && code === "tenant_inactive") {
        // Negocio cancelado: nadie entra, ni el dueño. La reactivación es por soporte.
        showAlert("Este negocio está inactivo. Contacta a soporte.");
      } else if (status === 403 && code === "subscription_expired") {
        showAlert("La suscripción del negocio venció. Contacta al propietario para reactivarla.");
      } else if (status === 400) {
        showAlert("Usuario o contraseña incorrectos.");
      } else {
        showAlert("No se pudo iniciar sesión. Intenta de nuevo.");
      }
    }
  };

  const { formData, alertData, showPassword } = state;

  return (
    <Box sx={{
      minHeight: '100vh', height: '100vh', display: 'flex',
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      bgcolor: 'background.paper',
    }}>
      {/* Panel izquierdo — marca (oculto en móvil) */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        flex: 1, position: 'relative',
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
        overflow: 'hidden',
        background: colors.gradient.sidebar,
      }}>
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', px: 6 }}>
          <Box component="img" src={LogoWhite} alt="SmartVenta" width={260} height="auto" sx={{
            maxWidth: 260, width: '100%', height: 'auto', mb: 4,
            filter: colors.shadow.logo,
          }} />
          <Typography variant="h4" sx={{
            color: 'common.white', fontWeight: 700, mb: 1.5, letterSpacing: '-0.01em',
          }}>
            Punto de venta multi-tienda
          </Typography>
          <Typography variant="body1" sx={{
            color: alpha(colors.white, 0.82), maxWidth: 380, mx: 'auto', lineHeight: 1.6,
          }}>
            Gestiona ventas, inventario y traspasos de todas tus tiendas desde un solo lugar.
          </Typography>
        </Box>
      </Box>

      {/* Panel derecho — formulario */}
      <Box sx={{
        flex: { xs: 1, md: 0.9 },
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        px: { xs: 3, sm: 6 }, py: 4,
        bgcolor: 'background.default',
      }}>
        <Paper elevation={0} sx={{
          width: '100%', maxWidth: 420,
          borderRadius: '16px',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: colors.shadow.card,
          p: { xs: 3, sm: 4 },
        }}>
          {/* Logo visible solo en móvil */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 3 }}>
            <Box component="img" src={LogoBlue} alt="SmartVenta" width={180} height="auto" sx={{ maxWidth: 180, height: 'auto' }} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
            Bienvenido
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Ingresa tus credenciales para continuar
          </Typography>

          {alertData.shown && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
              {alertData.message}
            </Alert>
          )}

          <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
            <TextField fullWidth name="username" label="Usuario" placeholder="Ingresa tu usuario"
              value={formData.username} onChange={handleChange}
              required autoFocus autoComplete="username" size="small"
            />

            <TextField fullWidth name="password" label="Contraseña" placeholder="Ingresa tu contraseña"
              type={showPassword ? "text" : "password"}
              value={formData.password} onChange={handleChange}
              required autoComplete="current-password" size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CustomTooltip text={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} position="top">
                      <IconButton size="small"
                        onClick={() => setState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                        edge="end"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </CustomTooltip>
                  </InputAdornment>
                ),
              }}
            />

            <CustomButton type="submit" fullWidth
              startIcon={<LoginIcon />}
              sx={{
                py: 1.25, mt: 1, borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem',
                background: colors.accent,
                color: colors.onAccent,
                boxShadow: colors.shadow.brand,
                '&:hover': {
                  background: colors.accentDark,
                  boxShadow: colors.shadow.brandHover,
                },
              }}
            >
              Iniciar sesión
            </CustomButton>

            <Button onClick={() => navigate("/registrarme")} fullWidth
              variant="outlined" startIcon={<PersonAddIcon />}
              sx={{
                py: 1, borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem',
                borderColor: 'divider', color: 'text.secondary',
                '&:hover': {
                  borderColor: 'primary.main', color: 'primary.main',
                  bgcolor: 'action.hover',
                },
              }}
            >
              Registrar nuevo cliente
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;
