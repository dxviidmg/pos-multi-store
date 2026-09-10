import React, { useState, useEffect } from "react";
import { loginUser } from "@/src/api/login";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/context/UserContext";
import CustomButton from "@/src/components/ui/Button/Button";
import Logo from "@/src/assets/images/logo.webp";
import { colors } from "@/src/theme/colors";
import './Login.css';
import {
  TextField, Box, Alert, Paper, Stack, Typography,
  IconButton, InputAdornment, Button,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";

function Login({ onLogin }) {
  const router = useRouter();
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
      const response = await loginUser(state.formData);
      if (response.status === 200) {
        login(response.data);
        if (response.data.access_blocked) {
          // Negocio vencido: el dueño entra solo para renovar/pagar
          router.push("/mi-plan-actual/");
        } else if (response.data.role === "owner") {
          router.push("/tiendas/");
        } else {
          router.push("/vender/");
        }
      } else {
        showAlert("Usuario o contraseña incorrecta");
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
        showAlert("Usuario o contraseña incorrecta");
      } else {
        showAlert("Error desconocido, intente nuevamente.");
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
          <Box component="img" src={Logo.src || Logo} alt="SmartVenta" sx={{
            maxWidth: 260, width: '100%', height: 'auto', mb: 4,
            filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.25))',
          }} />
          <Typography variant="h4" sx={{
            color: '#fff', fontWeight: 700, mb: 1.5, letterSpacing: '-0.01em',
          }}>
            Punto de venta multi-tienda
          </Typography>
          <Typography variant="body1" sx={{
            color: 'rgba(255,255,255,0.82)', maxWidth: 380, mx: 'auto', lineHeight: 1.6,
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
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          p: { xs: 3, sm: 4 },
        }}>
          {/* Logo visible solo en móvil */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 3 }}>
            <Box component="img" src={Logo.src || Logo} alt="SmartVenta" sx={{ maxWidth: 180, height: 'auto' }} />
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
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />

            <TextField fullWidth name="password" label="Contraseña" placeholder="Ingresa tu contraseña"
              type={showPassword ? "text" : "password"}
              value={formData.password} onChange={handleChange}
              required autoComplete="current-password" size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small"
                      onClick={() => setState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <CustomButton type="submit" fullWidth
              startIcon={<LoginIcon />}
              sx={{
                py: 1.25, mt: 1, borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem',
                background: 'linear-gradient(135deg, #04346b 0%, #065a9e 100%)',
                boxShadow: '0 4px 20px rgba(4,53,107,0.25)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #022347 0%, #04346b 100%)',
                  boxShadow: '0 8px 30px rgba(4,53,107,0.35)',
                },
              }}
            >
              Iniciar sesión
            </CustomButton>

            <Button onClick={() => router.push("/registrarme")} fullWidth
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
