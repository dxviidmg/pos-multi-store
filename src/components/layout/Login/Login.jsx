import React, { useState, useEffect } from "react";
import { loginUser } from "../../../api/login";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../ui/Button/Button";
import Logo from "../../../assets/images/logo.jpg";
import BgImage from "../../../assets/images/bg.webp";
import './login.css';
import { 
  TextField, 
  Box, 
  Alert, 
  Paper, 
  Stack, 
  Typography, 
  Checkbox, 
  FormControlLabel,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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
    rememberMe: false,
    showPassword: false,
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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

  const { formData, alertData, rememberMe, showPassword } = state;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${BgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: 2,
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 380,
          borderRadius: 5,
          overflow: 'hidden',
          background: `linear-gradient(145deg, ${colors.primary} 0%, #032a56 50%, #021f3f 100%)`,
          boxShadow: '0 24px 80px rgba(4, 52, 107, 0.4), 0 0 1px rgba(4, 52, 107, 0.1)',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            textAlign: 'center',
            pt: 6,
            pb: 3,
            px: 4,
          }}
        >
          <Box
            component="img"
            src={Logo}
            alt="SmartVenta"
            sx={{
              maxWidth: '190px',
              height: 'auto',
              mb: 3.5,
              borderRadius: 3,
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: 'float 3s ease-in-out infinite',
              '&:hover': {
                transform: 'scale(1.05) translateY(-8px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                animation: 'none',
              },
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-10px)' },
              }
            }}
          />
          
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'white',
              mb: 1.5,
              letterSpacing: 0.3,
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              animation: 'fadeInDown 0.6s ease-out',
              '@keyframes fadeInDown': {
                '0%': { opacity: 0, transform: 'translateY(-20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              }
            }}
          >
            Bienvenido
          </Typography>
          
          <Typography
            variant="body2"
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              fontSize: '0.938rem',
              fontWeight: 400,
              animation: 'fadeInUp 0.6s ease-out 0.2s both',
              '@keyframes fadeInUp': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              }
            }}
          >
            Ingrese sus credenciales para continuar
          </Typography>
        </Box>

        {/* Form */}
        <Box sx={{ 
          px: 4, 
          pb: 5,
          animation: 'fadeIn 0.8s ease-out 0.4s both',
          '@keyframes fadeIn': {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          }
        }}>
          {alertData.shown && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 3,
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: '1px solid rgba(244, 67, 54, 0.3)',
                fontWeight: 500,
                '& .MuiAlert-icon': {
                  color: '#ffcdd2',
                }
              }}
            >
              {alertData.message}
            </Alert>
          )}

          <Stack component="form" spacing={3}>
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'white', 
                  mb: 1.2, 
                  fontWeight: 600,
                  fontSize: '0.938rem',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                Usuario
              </Typography>
              <TextField
                fullWidth
                type="text"
                name="username"
                placeholder="Ingrese su usuario"
                value={formData.username}
                onChange={handleChange}
                required
                autoFocus
                autoComplete="username"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'white',
                    fontSize: '0.938rem',
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                  }
                }}
              />
            </Box>
            
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'white', 
                  mb: 1.2, 
                  fontWeight: 600,
                  fontSize: '0.938rem',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                Contraseña
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Ingrese su contraseña"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                        edge="end"
                        size="small"
                        sx={{ 
                          color: colors.primary,
                          '&:hover': { backgroundColor: 'rgba(4, 52, 107, 0.08)' }
                        }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'white',
                    fontSize: '0.938rem',
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                  }
                }}
              />
            </Box>


            <CustomButton
              onClick={handleSubmit}
              fullWidth


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
