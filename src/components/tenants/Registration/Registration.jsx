import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateTenant } from "../../../hooks/useRegistration";
import { useMercadoPago } from "../../../hooks/useMercadoPago";
import CustomButton from "../../ui/Button/Button";
import {
  Grid, TextField, Box, Typography, Paper,
  InputAdornment, CircularProgress, LinearProgress,
  Card, CardContent, Chip, Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Logo from "../../../assets/images/logo.jpg";
import BgImage from "../../../assets/images/bg.webp";
import { checkTenantExists, getAvailablePlans } from "../../../api/registration";

const INITIAL_FORM_DATA = {
  name: "",
  short_name: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
};

const TOTAL_STEPS = 3;
const STEP_LABELS = ["Negocio", "Propietario", "Plan"];

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1,
    fontSize: "0.9rem",
    backgroundColor: "rgba(255,255,255,0.95)",
    "& fieldset": { borderColor: "transparent" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
    "&.Mui-focused fieldset": {
      borderColor: "#a78bfa",
      boxShadow: "0 0 0 3px rgba(167,139,250,0.15)",
    },
  },
};

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [registered, setRegistered] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [shortNameStatus, setShortNameStatus] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  // Plan selection state
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Payment state
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const { createCardForm, unmountCardForm } = useMercadoPago();

  // Fetch plans when reaching step 3
  useEffect(() => {
    if (activeStep === 2 && plans.length === 0) {
      setPlansLoading(true);
      getAvailablePlans()
        .then((data) => {
          setPlans(data);
          if (data.length === 1) setSelectedPlan(data[0]);
        })
        .catch(() => setPlans([]))
        .finally(() => setPlansLoading(false));
    }
  }, [activeStep, plans.length]);

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
      unmountCardForm();
      setShowPayment(false);
      setPaymentSubmitting(false);
      setFormData(INITIAL_FORM_DATA);
      setRegistered(true);
    },
    onError: (error) => {
      setPaymentSubmitting(false);
      const msg = error.response?.data?.detail || error.response?.data?.error || "Error al crear la cuenta.";
      setPaymentResult({ success: false, message: msg });
    },
  });

  const mutation = createTenantMutation;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Show MercadoPago payment form — nothing is created yet
  const handleSubmit = (e) => {
    e.preventDefault();
    setPaymentResult(null);
    setShowPayment(true);
    setTimeout(() => {
      createCardForm({
        amount: selectedPlan.price,
        onSubmit: async ({ token, email, payment_method_id, issuer_id, installments }) => {
          setPaymentSubmitting(true);
          setPaymentResult(null);
          // Only after successful payment data, create tenant + subscription
          mutation.mutate({
            ...formData,
            plan_id: selectedPlan?.id,
            card_token: token,
            payer_email: email,
            payment_method_id,
            issuer_id,
            installments,
          });
        },
        onError: () => {
          setPaymentResult({ success: false, message: "Error en el formulario de pago." });
        },
      });
    }, 100);
  };

  const handleBackFromPayment = () => {
    unmountCardForm();
    setShowPayment(false);
    setPaymentResult(null);
  };

  const isStep1Valid = formData.name && formData.short_name && shortNameStatus === "available";
  const isStep2Valid = formData.first_name && formData.email && formData.phone_number;
  const isStep3Valid = !!selectedPlan;

  const isFormIncomplete = !isStep1Valid || !isStep2Valid || !isStep3Valid;

  return (
      <Box sx={{
        minHeight: "100vh",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
      }}>
        <Box sx={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(4,52,107,0.85) 0%, rgba(6,90,158,0.75) 100%)",
          backdropFilter: "blur(2px)",
        }} />

        <Paper elevation={0} sx={{
          position: "relative", zIndex: 1,
          width: "100%", maxWidth: 600, mx: 2,
          borderRadius: 1, overflow: "hidden",
          background: "rgba(4,52,107,0.95)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
        }}>
            {registered ? (
              // ─── Success state ─────────────────────────────────────
              <Box sx={{ px: 4, py: 4, textAlign: "center" }}>
                <Box sx={{
                  width: 48, height: 48, borderRadius: "50%",
                  bgcolor: "rgba(16,185,129,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  mx: "auto", mb: 2,
                }}>
                  <CheckCircleIcon sx={{ fontSize: 24, color: "#34d399" }} />
                </Box>
                <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", mb: 0.5 }}>
                  ¡Listo!
                </Typography>
                <Typography sx={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", mb: 2.5, lineHeight: 1.6 }}>
                  Tu negocio ha sido registrado.<br />Ya puedes iniciar sesión.
                </Typography>
                <CustomButton
                  onClick={() => navigate("/login")}
                  fullWidth
                  sx={{
                    py: 1.3,
                    borderRadius: 1,
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #a78bfa 0%, #7c5cbf 100%)",
                    color: "#fff",
                    "&:hover": {
                      background: "linear-gradient(135deg, #7c5cbf 0%, #6344a3 100%)",
                      boxShadow: "0 6px 20px rgba(167,139,250,0.4)",
                    },
                  }}
                >
                  Iniciar sesión
                </CustomButton>
                <Typography
                  sx={{
                    mt: 2, fontSize: "0.8rem", color: "rgba(255,255,255,0.6)",
                    fontWeight: 500, cursor: "pointer",
                    "&:hover": { color: "rgba(255,255,255,0.9)" },
                  }}
                  onClick={() => { setRegistered(false); setActiveStep(0); }}
                >
                  Registrar otro negocio
                </Typography>
              </Box>
            ) : (
              <>
                {/* Header */}
                <Box sx={{ px: 4, pt: 3, pb: 0, textAlign: "center" }}>
                  <Box
                    component="img"
                    src={Logo}
                    alt="SmartVenta"
                    sx={{
                      maxWidth: "120px", height: "auto", borderRadius: 0,
                      mb: 2,
                      boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                    }}
                  />
                  <Typography sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>
                    Crea tu negocio en un par de minutos
                  </Typography>
                </Box>

                {/* Progress */}
                <Box sx={{ px: 4, pt: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                      Paso {activeStep + 1} de {TOTAL_STEPS}
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>
                      {STEP_LABELS[activeStep]}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={((activeStep + 1) / TOTAL_STEPS) * 100}
                    sx={{
                      height: 3,
                      borderRadius: 2,
                      bgcolor: "rgba(255,255,255,0.1)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 2,
                        background: "linear-gradient(90deg, #a78bfa, #7c5cbf)",
                        transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
                      },
                    }}
                  />
                </Box>

                {/* Form */}
                <Box sx={{ px: 4, pt: 2.5, pb: 2.5 }}>
                  {activeStep === 0 && (
                    <Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", mb: 0.5 }}>
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
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", mb: 0.5 }}>
                          Identificador corto
                        </Typography>
                        <TextField
                          fullWidth size="small"
                          name="short_name"
                          value={formData.short_name}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\s/g, "");
                            setFormData((prev) => ({ ...prev, short_name: val }));
                          }}
                          required
                          placeholder="Ej: mitienda"
                          inputProps={{ maxLength: 10, style: { letterSpacing: "0.5px" } }}
                          InputProps={{
                            endAdornment: formData.short_name.trim() && (
                              <InputAdornment position="end" sx={{ mr: 0.5 }}>
                                <Box sx={{
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  width: 22, height: 22, borderRadius: "50%",
                                  transition: "all 0.2s ease",
                                  ...(shortNameStatus === "checking" && { bgcolor: "transparent" }),
                                  ...(shortNameStatus === "available" && { bgcolor: "rgba(5,150,105,0.1)" }),
                                  ...(shortNameStatus === "taken" && { bgcolor: "rgba(239,68,68,0.08)" }),
                                }}>
                                  {shortNameStatus === "checking" && <CircularProgress size={14} sx={{ color: "#6b7280" }} />}
                                  {shortNameStatus === "available" && <CheckCircleIcon sx={{ color: "#059669", fontSize: 16 }} />}
                                  {shortNameStatus === "taken" && <CancelIcon sx={{ color: "#dc2626", fontSize: 16 }} />}
                                </Box>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1,
                              fontSize: "0.9rem",
                              backgroundColor: "rgba(255,255,255,0.95)",
                              transition: "all 0.2s ease",
                              "& fieldset": {
                                borderColor: shortNameStatus === "available"
                                  ? "rgba(52,211,153,0.6)"
                                  : shortNameStatus === "taken"
                                  ? "rgba(239,68,68,0.6)"
                                  : "transparent",
                                transition: "border-color 0.2s ease",
                              },
                              "&:hover fieldset": {
                                borderColor: shortNameStatus === "available"
                                  ? "rgba(52,211,153,0.8)"
                                  : shortNameStatus === "taken"
                                  ? "rgba(239,68,68,0.7)"
                                  : "rgba(255,255,255,0.4)",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: shortNameStatus === "available"
                                  ? "#34d399"
                                  : shortNameStatus === "taken"
                                  ? "#ef4444"
                                  : "#a78bfa",
                                boxShadow: shortNameStatus === "available"
                                  ? "0 0 0 3px rgba(52,211,153,0.15)"
                                  : shortNameStatus === "taken"
                                  ? "0 0 0 3px rgba(239,68,68,0.1)"
                                  : "0 0 0 3px rgba(167,139,250,0.15)",
                              },
                            },
                          }}
                        />

                        {/* Help text — only visible when typing */}
                        {formData.short_name.trim() && (
                        <>
                        <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", mt: 0.75, lineHeight: 1.6 }}>
                          Código único de tu negocio para generar usuarios. Máx. 10 caracteres, solo letras y números. Se convierte a mayúsculas. <strong style={{ color: "rgba(255,255,255,0.7)" }}>No se puede cambiar después.</strong>
                        </Typography>
                        <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", mt: 0.5, lineHeight: 1.5 }}>
                          Ej: "Papelería Don Juan" podría ser{" "}
                          <span style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>pdj</span>,{" "}
                          <span style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>pdonjuan</span>,{" "}
                          <span style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>donjuan</span>,{" "}
                          <span style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>djpape</span> — no hay un formato obligatorio, elige algo único y significativo para ti.
                        </Typography>
                        <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", mt: 0.25, lineHeight: 1.5 }}>
                          Tus usuarios se crearán así: <span style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>{formData.short_name.trim().toLowerCase()}.propietario</span>, <span style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>{formData.short_name.trim().toLowerCase()}.tienda.centro</span>
                        </Typography>
                        </>
                        )}

                        {/* Status message — fixed height to prevent layout shift */}
                        <Box sx={{ minHeight: 24, mt: 0.75, display: "flex", alignItems: "center" }}>
                          {shortNameStatus === "checking" && (
                            <Typography sx={{
                              fontSize: "0.72rem", color: "rgba(255,255,255,0.6)",
                              display: "flex", alignItems: "center", gap: 0.5,
                              animation: "fadeIn 0.2s ease",
                              "@keyframes fadeIn": { from: { opacity: 0 }, to: { opacity: 1 } },
                            }}>
                              ⏳ Verificando disponibilidad...
                            </Typography>
                          )}
                          {shortNameStatus === "available" && (
                            <Typography sx={{
                              fontSize: "0.72rem", color: "#34d399", fontWeight: 500,
                              display: "flex", alignItems: "center", gap: 0.5,
                              animation: "fadeIn 0.2s ease",
                              "@keyframes fadeIn": { from: { opacity: 0, transform: "translateY(2px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                            }}>
                              ✓ Disponible
                            </Typography>
                          )}
                          {shortNameStatus === "taken" && (
                            <Typography sx={{
                              fontSize: "0.72rem", color: "#f87171", fontWeight: 500,
                              display: "flex", alignItems: "center", gap: 0.5,
                              animation: "fadeIn 0.2s ease",
                              "@keyframes fadeIn": { from: { opacity: 0, transform: "translateY(2px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                            }}>
                              ✕ Este identificador ya está en uso
                            </Typography>
                          )}
                        </Box>

                        {/* Suggestions when taken */}
                        {shortNameStatus === "taken" && (
                        <Box sx={{
                          mt: 0.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                          flexWrap: "wrap",
                        }}>
                          <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.5)" }}>
                            Prueba con:
                          </Typography>
                          {[
                            `${formData.short_name.trim().slice(0, 4)}1`,
                            `${formData.short_name.trim().slice(0, 3)}mx`,
                            `${formData.short_name.trim().slice(0, 3)}26`,
                          ].map((suggestion) => (
                            <Box
                              key={suggestion}
                              onClick={() => setFormData((prev) => ({ ...prev, short_name: suggestion }))}
                              sx={{
                                fontSize: "0.7rem",
                                px: 1,
                                py: 0.25,
                                borderRadius: "6px",
                                border: "1px solid rgba(255,255,255,0.2)",
                                color: "rgba(255,255,255,0.85)",
                                cursor: "pointer",
                                fontFamily: "monospace",
                                fontWeight: 500,
                                transition: "all 0.15s ease",
                                "&:hover": {
                                  bgcolor: "rgba(255,255,255,0.1)",
                                  borderColor: "rgba(255,255,255,0.4)",
                                },
                              }}
                            >
                              {suggestion}
                            </Box>
                          ))}
                        </Box>
                        )}
                      </Box>

                      <CustomButton
                        onClick={() => setActiveStep(1)}
                        disabled={!isStep1Valid}
                        fullWidth
                        endIcon={<ArrowForwardIcon sx={{ fontSize: "18px !important" }} />}
                        sx={{
                          mt: 0.5,
                          py: 1.3,
                          borderRadius: 1,
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          background: "linear-gradient(135deg, #a78bfa 0%, #7c5cbf 100%)",
                          color: "#fff",
                          "&:hover": {
                            background: "linear-gradient(135deg, #7c5cbf 0%, #6344a3 100%)",
                            boxShadow: "0 6px 20px rgba(167,139,250,0.4)",
                          },
                          "&.Mui-disabled": {
                            background: "rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.3)",
                            boxShadow: "none",
                          },
                        }}
                      >
                        Continuar
                      </CustomButton>
                    </Box>
                  )}

                  {activeStep === 1 && (
                    <Box>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", mb: 0.75 }}>
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
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", mb: 0.75 }}>
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
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", mb: 0.75 }}>
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
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", mb: 0.75 }}>
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

                      <Box sx={{ display: "flex", gap: 1.5, mt: 2.5 }}>
                        <CustomButton
                          onClick={() => setActiveStep(0)}
                          startIcon={<ArrowBackIcon sx={{ fontSize: "16px !important" }} />}
                          sx={{
                            py: 1.3, px: 2.5,
                            borderRadius: 1,
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.8)",
                            bgcolor: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                          }}
                        >
                          Atrás
                        </CustomButton>
                        <CustomButton
                          onClick={() => setActiveStep(2)}
                          disabled={!isStep2Valid}
                          fullWidth
                          endIcon={<ArrowForwardIcon sx={{ fontSize: "18px !important" }} />}
                          sx={{
                            py: 1.3,
                            borderRadius: 1,
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            background: "linear-gradient(135deg, #a78bfa 0%, #7c5cbf 100%)",
                            color: "#fff",
                            "&:hover": {
                              background: "linear-gradient(135deg, #7c5cbf 0%, #6344a3 100%)",
                              boxShadow: "0 6px 20px rgba(167,139,250,0.4)",
                            },
                            "&.Mui-disabled": {
                              background: "rgba(255,255,255,0.1)",
                              color: "rgba(255,255,255,0.3)",
                              boxShadow: "none",
                            },
                          }}
                        >
                          Continuar
                        </CustomButton>
                      </Box>
                    </Box>
                  )}

                  {activeStep === 2 && !showPayment && (
                    <Box>
                      {plansLoading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                          <CircularProgress size={28} sx={{ color: "#a78bfa" }} />
                        </Box>
                      ) : plans.length === 0 ? (
                        <Typography sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", textAlign: "center", py: 3 }}>
                          No hay planes disponibles en este momento.
                        </Typography>
                      ) : (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                          {plans.map((plan) => (
                            <Card
                              key={plan.id}
                              onClick={() => setSelectedPlan(plan)}
                              sx={{
                                cursor: "pointer",
                                borderRadius: 1,
                                bgcolor: selectedPlan?.id === plan.id
                                  ? "rgba(167,139,250,0.15)"
                                  : "rgba(255,255,255,0.05)",
                                border: selectedPlan?.id === plan.id
                                  ? "2px solid #a78bfa"
                                  : "2px solid rgba(255,255,255,0.1)",
                                boxShadow: selectedPlan?.id === plan.id
                                  ? "0 0 0 3px rgba(167,139,250,0.2)"
                                  : "none",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  borderColor: "rgba(167,139,250,0.5)",
                                  bgcolor: "rgba(167,139,250,0.08)",
                                },
                              }}
                            >
                              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <Box>
                                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>
                                      {plan.name}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                      <Chip
                                        icon={<StorefrontIcon sx={{ fontSize: "14px !important", color: "rgba(255,255,255,0.7) !important" }} />}
                                        label={`${plan.stores} ${plan.stores === 1 ? "tienda" : "tiendas"}`}
                                        size="small"
                                        sx={{
                                          fontSize: "0.72rem", height: 22,
                                          bgcolor: "rgba(255,255,255,0.1)",
                                          color: "rgba(255,255,255,0.8)",
                                          border: "1px solid rgba(255,255,255,0.15)",
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                  <Box sx={{ textAlign: "right" }}>
                                    <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: "#a78bfa" }}>
                                      ${plan.price}
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}>
                                      MXN/mes
                                    </Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                        </Box>
                      )}

                      <Box sx={{ display: "flex", gap: 1.5, mt: 2.5 }}>
                        <CustomButton
                          onClick={() => setActiveStep(1)}
                          startIcon={<ArrowBackIcon sx={{ fontSize: "16px !important" }} />}
                          sx={{
                            py: 1.3, px: 2.5,
                            borderRadius: 1,
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.8)",
                            bgcolor: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                          }}
                        >
                          Atrás
                        </CustomButton>
                        <CustomButton
                          onClick={handleSubmit}
                          disabled={isFormIncomplete || mutation.isPending}
                          fullWidth
                          sx={{
                            py: 1.3,
                            borderRadius: 1,
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            background: "linear-gradient(135deg, #a78bfa 0%, #7c5cbf 100%)",
                            color: "#fff",
                            "&:hover": {
                              background: "linear-gradient(135deg, #7c5cbf 0%, #6344a3 100%)",
                              boxShadow: "0 6px 20px rgba(167,139,250,0.4)",
                            },
                            "&.Mui-disabled": {
                              background: "rgba(255,255,255,0.1)",
                              color: "rgba(255,255,255,0.3)",
                              boxShadow: "none",
                            },
                          }}
                        >
                          {mutation.isPending ? "Creando cuenta..." : "Crear cuenta y pagar"}
                        </CustomButton>
                      </Box>
                    </Box>
                  )}

                  {showPayment && (
                    <Box>
                      {paymentResult && (
                        <Alert severity="error" sx={{
                          mb: 2, borderRadius: 1, fontSize: "0.85rem",
                          backgroundColor: "rgba(239,68,68,0.15)",
                          color: "#fca5a5",
                          border: "1px solid rgba(239,68,68,0.3)",
                          "& .MuiAlert-icon": { color: "#f87171" },
                        }}>
                          {paymentResult.message}
                        </Alert>
                      )}
                      <Typography sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", mb: 2 }}>
                        Se activará cobro recurrente de <strong style={{ color: "#fff" }}>${selectedPlan?.price} MXN/mes</strong> con tu tarjeta.
                      </Typography>
                      {paymentSubmitting && (
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                          <CircularProgress size={24} sx={{ color: "#a78bfa" }} />
                        </Box>
                      )}
                      <div id="mp-bricks-container" />
                      {!paymentSubmitting && (
                        <CustomButton
                          onClick={handleBackFromPayment}
                          startIcon={<ArrowBackIcon sx={{ fontSize: "16px !important" }} />}
                          sx={{
                            mt: 2, py: 1, px: 2.5,
                            borderRadius: 1,
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.8)",
                            bgcolor: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                          }}
                        >
                          Atrás
                        </CustomButton>
                      )}
                    </Box>
                  )}
                </Box>

                {/* Footer */}
                <Box sx={{
                  px: 4, py: 2,
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  textAlign: "center",
                }}>
                  <Typography sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>
                    ¿Ya tienes una cuenta?{" "}
                    <Box
                      component="span"
                      sx={{
                        color: "#a78bfa",
                        fontWeight: 600,
                        cursor: "pointer",
                        "&:hover": { color: "#c4b5fd" },
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
    );
};

export default Registration;
