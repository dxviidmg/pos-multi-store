import React, { useState, useEffect } from "react";
import { loginUser } from "../../../api/login";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import LogoWhite from "../../../assets/images/logo-white.svg";
import { colors } from "../../../theme/colors";
import { isOwner } from "../../../constants/routeAccess";
import { alpha } from "@mui/material/styles";
import {
  TextField, Box, Alert, Paper, Stack, Typography,
  IconButton, InputAdornment, Button, CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  desktopLabelSx, mobileInputSx,
  desktopPrimaryButtonSx, mobilePrimaryButtonSx,
  desktopSecondaryButtonSx, mobileSecondaryButtonSx,
} from "./Login.styles";

/** Traduce un error de login a un mensaje en español según status y code del backend. */
const mapLoginError = (error) => {
  const status = error.response?.status;
  const code = error.response?.data?.code;
  if (status === 403 && code === "tenant_inactive") {
    // Negocio cancelado: nadie entra, ni el dueño. La reactivación es por soporte.
    return "Este negocio está inactivo. Contacta a soporte.";
  }
  if (status === 403 && code === "subscription_expired") {
    return "La suscripción del negocio venció. Contacta al propietario para reactivarla.";
  }
  if (status === 400) {
    return "Usuario o contraseña incorrectos.";
  }
  return "No se pudo iniciar sesión. Intenta de nuevo.";
};

function Login() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // evita dobles envíos
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Usuario y contraseña son obligatorios.");
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await loginUser(formData);
      login(data);
      if (data.access_blocked) {
        // Negocio vencido: el dueño entra solo para renovar/pagar
        navigate("/mi-plan-actual/");
      } else if (isOwner(data)) {
        navigate("/tiendas/");
      } else {
        navigate("/vender/");
      }
    } catch (err) {
      setError(mapLoginError(err));
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const isFormEmpty = !formData.username.trim() || !formData.password.trim();

  const passwordAdornment = (
    <InputAdornment position="end">
      <CustomTooltip text={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} position="top">
        <IconButton size="small" onClick={toggleShowPassword} edge="end"
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
        </IconButton>
      </CustomTooltip>
    </InputAdornment>
  );

  return (
    <Box sx={{
      minHeight: '100vh', height: '100vh', display: 'flex',
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      bgcolor: { xs: colors.sidebar, md: 'background.paper' },
      flexDirection: { xs: 'column', md: 'row' },
      // Textura de marca (brillo + trama) solo en móvil, igual que el panel de marca de escritorio
      backgroundImage: {
        xs: [
          `radial-gradient(520px circle at 85% 8%, ${alpha(colors.secondary, 0.22)}, transparent 60%)`,
          `radial-gradient(${alpha(colors.white, 0.07)} 1px, transparent 1px)`,
        ].join(','),
        md: 'none',
      },
      backgroundSize: { xs: 'auto, 22px 22px', md: 'auto' },
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
          <Box component="img" src={LogoWhite} alt="SmartVenta" width={312} height="auto" sx={{
            maxWidth: 312, width: '100%', height: 'auto', mb: 4,
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
        px: { xs: 3, sm: 6 }, py: { xs: 4, md: 4 },
        bgcolor: { xs: 'transparent', md: 'background.default' },
      }}>
        {/* Tarjeta solo en desktop */}
        <Paper elevation={0} sx={{
          display: { xs: 'none', md: 'block' },
          width: '100%', maxWidth: 420,
          borderRadius: '16px',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: colors.shadow.card,
          p: { xs: 3, sm: 4 },
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
            Bienvenido
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Ingresa tus credenciales para continuar
          </Typography>

          {error && (
            <Alert severity="error" icon={<ErrorOutlineIcon fontSize="small" />} sx={{ mb: 3, borderRadius: '10px' }}>
              {error}
            </Alert>
          )}

          <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
            <TextField fullWidth name="username" label="Usuario" placeholder="Ingresa tu usuario"
              value={formData.username} onChange={handleChange}
              required autoFocus autoComplete="username" size="small"
              sx={desktopLabelSx}
            />

            <TextField fullWidth name="password" label="Contraseña" placeholder="Ingresa tu contraseña"
              type={showPassword ? "text" : "password"}
              value={formData.password} onChange={handleChange}
              required autoComplete="current-password" size="small"
              sx={desktopLabelSx}
              InputProps={{ endAdornment: passwordAdornment }}
            />

            <CustomButton type="submit" fullWidth
              disabled={isLoading || isFormEmpty}
              startIcon={isLoading ? <CircularProgress size={18} sx={{ color: colors.white }} /> : <LoginIcon />}
              sx={desktopPrimaryButtonSx}
            >
              {isLoading ? "Iniciando sesión…" : "Iniciar sesión"}
            </CustomButton>

            <Button onClick={() => navigate("/registrarme")} fullWidth
              variant="outlined" startIcon={<PersonAddIcon />}
              sx={desktopSecondaryButtonSx}
            >
              Crear mi negocio
            </Button>
          </Stack>
        </Paper>

        {/* Formulario solo en móvil — sin tarjeta */}
        <Box sx={{
          display: { xs: 'block', md: 'none' },
          width: '100%',
          maxWidth: 360,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Box component="img" src={LogoWhite} alt="SmartVenta" width={144} height="auto" sx={{ maxWidth: 144, height: 'auto' }} />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 700, color: 'common.white', mb: 0.5, textAlign: 'center' }}>
            Bienvenido
          </Typography>
          <Typography variant="body2" sx={{ color: alpha(colors.white, 0.8), mb: 3, textAlign: 'center' }}>
            Ingresa tus credenciales para continuar
          </Typography>

          {error && (
            <Alert severity="error" icon={<ErrorOutlineIcon fontSize="small" />} sx={{ mb: 3, borderRadius: '10px' }}>
              {error}
            </Alert>
          )}

          <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
            <TextField fullWidth name="username" label="Usuario" placeholder="Ingresa tu usuario"
              value={formData.username} onChange={handleChange}
              required autoFocus autoComplete="username" size="small"
              sx={mobileInputSx}
            />

            <TextField fullWidth name="password" label="Contraseña" placeholder="Ingresa tu contraseña"
              type={showPassword ? "text" : "password"}
              value={formData.password} onChange={handleChange}
              required autoComplete="current-password" size="small"
              sx={mobileInputSx}
              InputProps={{ endAdornment: passwordAdornment }}
            />

            <CustomButton type="submit" fullWidth
              disabled={isLoading || isFormEmpty}
              startIcon={isLoading ? <CircularProgress size={18} sx={{ color: colors.sidebar }} /> : <LoginIcon />}
              sx={mobilePrimaryButtonSx}
            >
              {isLoading ? "Iniciando sesión…" : "Iniciar sesión"}
            </CustomButton>

            <Button onClick={() => navigate("/registrarme")} fullWidth
              variant="outlined" startIcon={<PersonAddIcon />}
              sx={mobileSecondaryButtonSx}
            >
              Crear mi negocio
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
