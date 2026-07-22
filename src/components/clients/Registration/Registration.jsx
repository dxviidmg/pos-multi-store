import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterClient, useCreateTenant } from "../../../hooks/useRegistration";
import CustomButton from "../../ui/Button/Button";
import CustomModal from "../../ui/Modal/Modal";
import {
  Grid, TextField, Box, Typography, Paper,
  InputAdornment, CircularProgress, LinearProgress,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Logo from "../../../assets/images/logo.jpg";
import { checkTenantExists } from "../../../api/registration";

const INITIAL_FORM_DATA = {
  name: "",
  short_name: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
};

const TOTAL_STEPS = 2;

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: "0.9rem",
    bgcolor: "#fff",
    "& fieldset": { borderColor: "rgba(4,52,107,0.15)" },
    "&:hover fieldset": { borderColor: "rgba(4,52,107,0.35)" },
    "&.Mui-focused fieldset": {
      borderColor: "#04346b",
      boxShadow: "0 0 0 3px rgba(4,52,107,0.08)",
    },
  },
};

const Registration = ({ isOpen, onClose }) => {
  const isStandalone = isOpen === undefined;
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [registered, setRegistered] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [shortNameStatus, setShortNameStatus] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const value = formData.short_name.trim();
    if (!value) { setShortNameStatus(null); return; }

    setShortNameStatus("checking");
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await checkTenantExists(value);
        setShortNameStatus(data.exists ? "taken" : "available");
      } catch {
        setShortNameStatus(null);
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [formData.short_name]);

  const createTenantMutation = useCreateTenant({
    onSuccess: () => {
      setFormData(INITIAL_FORM_DATA);
      setRegistered(true);
    },
  });

  const registerClientMutation = useRegisterClient({
    onSuccess: () => {
      setFormData(INITIAL_FORM_DATA);
      onClose();
    },
  });

  const mutation = isStandalone ? createTenantMutation : registerClientMutation;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const isStep1Valid = formData.name && formData.short_name && shortNameStatus === "available";
  const isStep2Valid = formData.first_name && formData.email && formData.phone_number;

  const isFormIncomplete = isStandalone
    ? !isStep1Valid || !isStep2Valid
    : !formData.first_name || !formData.phone_number;

  // ─── Standalone page ───────────────────────────────────────────────
  if (isStandalone) {
    return (
      <Box sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #04346b 0%, #065a9e 40%, #0a7fd4 100%)",
        py: 4,
        px: 2,
      }}>
        <Box sx={{ width: "100%", maxWidth: 440 }}>
          {/* Card */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: "18px",
              border: "none",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.05)",
              overflow: "hidden",
              bgcolor: "#fff",
            }}
          >
            {registered ? (
              // ─── Success state ─────────────────────────────────────
              <Box sx={{ px: 4, py: 5, textAlign: "center" }}>
                <Box sx={{
                  width: 56, height: 56, borderRadius: "50%",
                  bgcolor: "rgba(16,185,129,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  mx: "auto", mb: 2.5,
                }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 28, color: "#10b981" }} />
                </Box>
                <Typography sx={{ fontSize: "1.35rem", fontWeight: 700, color: "#111827", mb: 0.5 }}>
                  ¡Listo!
                </Typography>
                <Typography sx={{ fontSize: "0.875rem", color: "#6b7280", mb: 3.5, lineHeight: 1.6 }}>
                  Tu negocio ha sido registrado.<br />Ya puedes iniciar sesión.
                </Typography>
                <CustomButton
                  onClick={() => navigate("/login")}
                  fullWidth
                  sx={{
                    py: 1.4,
                    borderRadius: "10px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #04346b 0%, #065a9e 100%)",
                    color: "#fff",
                    "&:hover": {
                      background: "linear-gradient(135deg, #022347 0%, #04346b 100%)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 14px rgba(4,52,107,0.4)",
                    },
                  }}
                >
                  Iniciar sesión
                </CustomButton>
                <Typography
                  sx={{
                    mt: 2, fontSize: "0.8rem", color: "#04346b",
                    fontWeight: 500, cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  onClick={() => { setRegistered(false); setActiveStep(0); }}
                >
                  Registrar otro negocio
                </Typography>
              </Box>
            ) : (
              <>
                {/* Header */}
                <Box sx={{ px: 4, pt: 4, pb: 0, textAlign: "center" }}>
                  <Box
                    component="img"
                    src={Logo}
                    alt="SmartVenta"
                    sx={{
                      width: 44, height: 44, borderRadius: "10px",
                      objectFit: "cover", mb: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Typography sx={{ fontSize: "1.35rem", fontWeight: 700, color: "#04346b", mb: 0.5 }}>
                    Crear tu negocio
                  </Typography>
                  <Typography sx={{ fontSize: "0.85rem", color: "#4a5568" }}>
                    Empieza gratis · Solo toma un par de minutos
                  </Typography>
                </Box>

                {/* Progress */}
                <Box sx={{ px: 4, pt: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#04346b" }}>
                      Paso {activeStep + 1} de {TOTAL_STEPS}
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                      {activeStep === 0 ? "Negocio" : "Propietario"}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={((activeStep + 1) / TOTAL_STEPS) * 100}
                    sx={{
                      height: 3,
                      borderRadius: 2,
                      bgcolor: "rgba(4,52,107,0.08)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 2,
                        background: "linear-gradient(90deg, #04346b, #065a9e)",
                        transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
                      },
                    }}
                  />
                </Box>

                {/* Form */}
                <Box sx={{ px: 4, pt: 3, pb: 3.5 }}>
                  {activeStep === 0 && (
                    <Box>
                      <Box sx={{ mb: 2.5 }}>
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#04346b", mb: 0.75 }}>
                          Nombre del negocio
                        </Typography>
                        <TextField
                          fullWidth size="small"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Ej: Mi Tienda de Ropa"
                          sx={inputSx}
                        />
                      </Box>

                      <Box sx={{ mb: 1 }}>
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#04346b", mb: 0.75 }}>
                          Identificador corto
                        </Typography>
                        <TextField
                          fullWidth size="small"
                          name="short_name"
                          value={formData.short_name}
                          onChange={handleChange}
                          required
                          placeholder="Ej: MTRPA"
                          inputProps={{ maxLength: 5 }}
                          InputProps={{
                            endAdornment: formData.short_name.trim() && (
                              <InputAdornment position="end">
                                {shortNameStatus === "checking" && <CircularProgress size={16} sx={{ color: "#9ca3af" }} />}
                                {shortNameStatus === "available" && <CheckCircleOutlineIcon sx={{ color: "#10b981", fontSize: 18 }} />}
                                {shortNameStatus === "taken" && <CancelOutlinedIcon sx={{ color: "#ef4444", fontSize: 18 }} />}
                              </InputAdornment>
                            ),
                          }}
                          helperText={
                            shortNameStatus === "taken" ? "Este identificador ya está en uso"
                            : shortNameStatus === "available" ? "¡Disponible!"
                            : "Máx. 5 caracteres · Debe ser único"
                          }
                          error={shortNameStatus === "taken"}
                          FormHelperTextProps={{ sx: { fontSize: "0.72rem", mt: 0.5, ml: 0.25 } }}
                          sx={inputSx}
                        />
                      </Box>

                      <CustomButton
                        onClick={() => setActiveStep(1)}
                        disabled={!isStep1Valid}
                        fullWidth
                        endIcon={<ArrowForwardIcon sx={{ fontSize: "18px !important" }} />}
                        sx={{
                          mt: 2.5,
                          py: 1.4,
                          borderRadius: "10px",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          background: "linear-gradient(135deg, #04346b 0%, #065a9e 100%)",
                          color: "#fff",
                          "&:hover": {
                            background: "linear-gradient(135deg, #022347 0%, #04346b 100%)",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 14px rgba(4,52,107,0.4)",
                          },
                          "&.Mui-disabled": {
                            background: "#e5e7eb",
                            color: "#9ca3af",
                            boxShadow: "none",
                          },
                        }}
                      >
                        Continuar
                      </CustomButton>
                    </Box>
                  )}

                  {activeStep === 1 && (
                    <Box component="form" onSubmit={handleSubmit}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#04346b", mb: 0.75 }}>
                            Nombre *
                          </Typography>
                          <TextField
                            fullWidth size="small"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            autoFocus
                            placeholder="Tu nombre"
                            sx={inputSx}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#04346b", mb: 0.75 }}>
                            Apellidos
                          </Typography>
                          <TextField
                            fullWidth size="small"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Tus apellidos"
                            sx={inputSx}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#04346b", mb: 0.75 }}>
                            Correo electrónico *
                          </Typography>
                          <TextField
                            fullWidth size="small"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            type="email"
                            placeholder="correo@ejemplo.com"
                            sx={inputSx}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#04346b", mb: 0.75 }}>
                            Teléfono *
                          </Typography>
                          <TextField
                            fullWidth size="small"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                            type="tel"
                            placeholder="10 dígitos"
                            sx={inputSx}
                          />
                        </Grid>
                      </Grid>

                      <Box sx={{ display: "flex", gap: 1.5, mt: 3 }}>
                        <CustomButton
                          onClick={() => setActiveStep(0)}
                          startIcon={<ArrowBackIcon sx={{ fontSize: "16px !important" }} />}
                          sx={{
                            py: 1.4, px: 2.5,
                            borderRadius: "10px",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "#374151",
                            bgcolor: "#f3f4f6",
                            border: "1px solid rgba(0,0,0,0.06)",
                            "&:hover": { bgcolor: "#e5e7eb" },
                          }}
                        >
                          Atrás
                        </CustomButton>
                        <CustomButton
                          type="submit"
                          fullWidth
                          disabled={isFormIncomplete || mutation.isPending}
                          sx={{
                            py: 1.4,
                            borderRadius: "10px",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            background: "linear-gradient(135deg, #04346b 0%, #065a9e 100%)",
                            color: "#fff",
                            "&:hover": {
                              background: "linear-gradient(135deg, #022347 0%, #04346b 100%)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 4px 14px rgba(4,52,107,0.4)",
                            },
                            "&.Mui-disabled": {
                              background: "#e5e7eb",
                              color: "#9ca3af",
                              boxShadow: "none",
                            },
                          }}
                        >
                          {mutation.isPending ? "Creando cuenta..." : "Crear cuenta"}
                        </CustomButton>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Footer */}
                <Box sx={{
                  px: 4, py: 2.5,
                  borderTop: "1px solid rgba(0,0,0,0.05)",
                  textAlign: "center",
                }}>
                  <Typography sx={{ fontSize: "0.82rem", color: "#6b7280" }}>
                    ¿Ya tienes una cuenta?{" "}
                    <Box
                      component="span"
                      sx={{
                        color: "#04346b",
                        fontWeight: 600,
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}
                      onClick={() => navigate("/login")}
                    >
                      Inicia sesión
                    </Box>
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Box>
      </Box>
    );
  }

  // ─── Modal mode (registro de cliente desde sesión) ─────────────────
  return (
    <CustomModal showOut={isOpen} onClose={onClose} title="Registro de Cliente">
      <Box sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Nombre *" name="first_name" value={formData.first_name} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth size="small" label="Apellidos" name="last_name" value={formData.last_name} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth size="small" label="Teléfono *" name="phone_number" value={formData.phone_number} onChange={handleChange} required type="tel" />
            </Grid>
            <Grid item xs={12}>
              <CustomButton
                fullWidth
                type="submit"
                disabled={isFormIncomplete || mutation.isPending}
                startIcon={<PersonAddIcon />}
                variant="contained"
                sx={{ py: 1.3, mt: 1 }}
              >
                {mutation.isPending ? "Registrando..." : "Registrar Cliente"}
              </CustomButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </CustomModal>
  );
};

export default Registration;
