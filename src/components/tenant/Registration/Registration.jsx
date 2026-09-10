import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCreateTenant } from "@/src/hooks/useRegistration";
import { useMercadoPago } from "@/src/hooks/useMercadoPago";
import CustomButton from "@/src/shared/ui/Button/Button";
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
import Logo from "@/src/shared/assets/images/logo.webp";
import { checkTenantExists, getAvailablePlans } from "@/src/api/registration";
import {
  inputSx, pageContainerSx, overlayGradientSx, formPaperSx,
  successIconSx, stepIndicatorSx, stepCountSx,
  progressBarSx, primaryButtonSx, secondaryButtonSx, headerBannerSx,
} from "@/src/components/tenant/Registration/Registration.styles";

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

const Registration = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [registered, setRegistered] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [shortNameStatus, setShortNameStatus] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'auto';
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

  const [ownerUsername, setOwnerUsername] = useState("");

  const createTenantMutation = useCreateTenant({
    onSuccess: (data) => {
      unmountCardForm();
      setShowPayment(false);
      setPaymentSubmitting(false);
      setOwnerUsername(data?.username || "");
      setFormData(INITIAL_FORM_DATA);
      setRegistered(true);
    },
    onError: (error) => {
      setPaymentSubmitting(false);
      const msg = error.response?.data?.detail || error.response?.data?.error || "Error al crear la cuenta.";
      setPaymentResult({ success: false, message: msg });
      // Recreate payment form so user can retry
      unmountCardForm();
      setTimeout(() => {
        createCardForm({
          amount: selectedPlan.price,
          onSubmit: async ({ token, email, payment_method_id, issuer_id, installments }) => {
            setPaymentSubmitting(true);
            setPaymentResult(null);
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
      <Box sx={pageContainerSx}>
        <Box sx={overlayGradientSx} />

        <Paper elevation={0} sx={formPaperSx}>
            {registered ? (
              // ─── Success state ─────────────────────────────────────
              <Box sx={{ px: 4, py: 4, textAlign: "center" }}>
                <Box sx={successIconSx}>
                  <CheckCircleIcon sx={{ fontSize: 24, color: "#11998e" }} />
                </Box>
                <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, color: "text.primary", mb: 0.5 }}>
                  ¡Listo!
                </Typography>
                <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 1, lineHeight: 1.6 }}>
                  Tu negocio ha sido registrado.<br />
                  Tu pago se procesa en un máximo de 24 horas.<br />
                  Por el momento, ya puedes iniciar sesión.
                </Typography>
                {ownerUsername && (
                  <Box sx={{
                    mb: 2.5, px: 2, py: 1.5,
                    borderRadius: "10px",
                    bgcolor: "action.hover",
                    border: "1px solid",
                    borderColor: "divider",
                  }}>
                    <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.75 }}>
                      Usuario y contraseña predeterminados:
                    </Typography>
                    <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "primary.main", fontFamily: "monospace", letterSpacing: "0.5px" }}>
                      {ownerUsername}
                    </Typography>
                    <Typography sx={{ fontSize: "0.7rem", color: "text.secondary", mt: 0.75, lineHeight: 1.5 }}>
                      Usa este mismo valor como usuario y contraseña para tu primer inicio de sesión.
                    </Typography>
                  </Box>
                )}
                <CustomButton
                  onClick={() => router.push("/")}
                  fullWidth
                  sx={primaryButtonSx}
                >
                  Iniciar sesión
                </CustomButton>
                <Typography
                  sx={{
                    mt: 2, fontSize: "0.8rem", color: "text.secondary",
                    fontWeight: 500, cursor: "pointer",
                    "&:hover": { color: "primary.main" },
                  }}
                  onClick={() => { setRegistered(false); setActiveStep(0); }}
                >
                  Registrar otro negocio
                </Typography>
              </Box>
            ) : (
              <>
                {/* Header banner azul */}
                <Box sx={headerBannerSx}>
                  <Box
                    component="img"
                    src={Logo.src || Logo}
                    alt="SmartVenta"
                    sx={{ maxWidth: "150px", height: "auto", display: "block", mx: "auto", mb: 2 }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff", mb: 0.5 }}>
                    Crea tu cuenta
                  </Typography>
                  <Typography sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)" }}>
                    Configura tu negocio en un par de minutos
                  </Typography>
                </Box>

                {/* Progress */}
                <Box sx={{ px: 4, pt: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography sx={stepIndicatorSx}>
                      Paso {activeStep + 1} de {TOTAL_STEPS}
                    </Typography>
                    <Typography sx={stepCountSx}>
                      {STEP_LABELS[activeStep]}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={((activeStep + 1) / TOTAL_STEPS) * 100}
                    sx={progressBarSx}
                  />
                </Box>

                {/* Form */}
                <Box sx={{ px: 4, pt: 2.5, pb: 2.5 }}>
                  {activeStep === 0 && (
                    <Box>
                      <Box sx={{ mb: 2.5 }}>
                        <TextField
                          fullWidth size="small"
                          label="Nombre del negocio"
                          name="name"
                          value={formData.name}
                          onChange={(e) => {
                            const capitalized = e.target.value
                              .toLowerCase()
                              .replace(/\b(\w)/g, (m) => m.toUpperCase());
                            setFormData((prev) => ({ ...prev, name: capitalized }));
                          }}
                          required
                          placeholder="Ej: Mi Tienda"
                          inputProps={{ autoCapitalize: "none", autoCorrect: "off" }}
                          sx={inputSx}
                        />
                      </Box>

                      <Box sx={{ mb: 1 }}>
                        <TextField
                          fullWidth size="small"
                          label="Clave de tu negocio"
                          helperText="Identificador único para tu negocio, verifica disponibilidad"
                          name="short_name"
                          value={formData.short_name}
                          onChange={(e) => {
                            const val = e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9.]/g, "");
                            setFormData((prev) => ({ ...prev, short_name: val }));
                          }}
                          required
                          placeholder="Ej: mitienda, mi.tienda, mt, tiendita, tienda, mtnd, abc, wyz"
                          inputProps={{
                            maxLength: 10,
                            autoCapitalize: "none",
                            autoCorrect: "off",
                            autoComplete: "off",
                            spellCheck: false,
                            style: { letterSpacing: "0.5px", textTransform: "lowercase" },
                          }}
                          InputProps={{
                            endAdornment: formData.short_name.trim() && (
                              <InputAdornment position="end" sx={{ mr: 0.5 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  {shortNameStatus === "checking" && (
                                    <Typography sx={{ fontSize: "0.72rem", color: "#6b7280", fontWeight: 500 }}>
                                      Verificando...
                                    </Typography>
                                  )}
                                  {shortNameStatus === "available" && (
                                    <Typography sx={{ fontSize: "0.72rem", color: "#059669", fontWeight: 600 }}>
                                      Disponible
                                    </Typography>
                                  )}
                                  {shortNameStatus === "taken" && (
                                    <Typography sx={{ fontSize: "0.72rem", color: "#dc2626", fontWeight: 600 }}>
                                      En uso
                                    </Typography>
                                  )}
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
                                </Box>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                              fontSize: "0.9rem",
                              backgroundColor: "background.paper",
                              transition: "all 0.2s ease",
                              "& fieldset": {
                                borderColor: shortNameStatus === "available"
                                  ? "rgba(17,153,142,0.6)"
                                  : shortNameStatus === "taken"
                                  ? "rgba(239,68,68,0.6)"
                                  : undefined,
                                transition: "border-color 0.2s ease",
                              },
                              "&:hover fieldset": {
                                borderColor: shortNameStatus === "available"
                                  ? "rgba(17,153,142,0.8)"
                                  : shortNameStatus === "taken"
                                  ? "rgba(239,68,68,0.7)"
                                  : undefined,
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: shortNameStatus === "available"
                                  ? "#11998e"
                                  : shortNameStatus === "taken"
                                  ? "#ef4444"
                                  : "#065a9e",
                                boxShadow: shortNameStatus === "available"
                                  ? "0 0 0 3px rgba(17,153,142,0.15)"
                                  : shortNameStatus === "taken"
                                  ? "0 0 0 3px rgba(239,68,68,0.1)"
                                  : "0 0 0 3px rgba(6,90,158,0.15)",
                              },
                            },
                            "& label.Mui-focused": {
                              color: shortNameStatus === "available"
                                ? "#11998e"
                                : shortNameStatus === "taken"
                                ? "#ef4444"
                                : "#065a9e",
                            },
                          }}
                        />

                        {/* Suggestions when taken */}
                        {shortNameStatus === "taken" && (
                        <Box sx={{
                          mt: 0.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                          flexWrap: "wrap",
                        }}>
                          <Typography sx={{ fontSize: "0.68rem", color: "text.secondary" }}>
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
                                border: "1px solid",
                                borderColor: "divider",
                                color: "text.primary",
                                cursor: "pointer",
                                fontFamily: "monospace",
                                fontWeight: 500,
                                transition: "all 0.15s ease",
                                "&:hover": {
                                  bgcolor: "action.hover",
                                  borderColor: "primary.main",
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
                        sx={{ mt: 0.5, ...primaryButtonSx }}
                      >
                        Continuar
                      </CustomButton>
                    </Box>
                  )}

                  {activeStep === 1 && (
                    <Box>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth size="small"
                            label="Nombre"
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
                          <TextField
                            fullWidth size="small"
                            label="Apellidos"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Tus apellidos"
                            sx={inputSx}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth size="small"
                            label="Correo electrónico"
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
                          <TextField
                            fullWidth size="small"
                            label="Teléfono"
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
                          sx={secondaryButtonSx}
                        >
                          Atrás
                        </CustomButton>
                        <CustomButton
                          onClick={() => setActiveStep(2)}
                          disabled={!isStep2Valid}
                          fullWidth
                          endIcon={<ArrowForwardIcon sx={{ fontSize: "18px !important" }} />}
                          sx={primaryButtonSx}
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
                          <CircularProgress size={28} sx={{ color: "primary.main" }} />
                        </Box>
                      ) : plans.length === 0 ? (
                        <Typography sx={{ fontSize: "0.85rem", color: "text.secondary", textAlign: "center", py: 3 }}>
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
                                borderRadius: "12px",
                                bgcolor: selectedPlan?.id === plan.id
                                  ? "rgba(4,53,107,0.06)"
                                  : "background.paper",
                                border: selectedPlan?.id === plan.id
                                  ? "2px solid #065a9e"
                                  : "2px solid",
                                borderColor: selectedPlan?.id === plan.id ? "#065a9e" : "divider",
                                boxShadow: selectedPlan?.id === plan.id
                                  ? "0 0 0 3px rgba(6,90,158,0.15)"
                                  : "none",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  borderColor: "primary.main",
                                  bgcolor: "rgba(4,53,107,0.04)",
                                },
                              }}
                            >
                              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <Box>
                                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "text.primary" }}>
                                      {plan.name}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                      <Chip
                                        icon={<StorefrontIcon sx={{ fontSize: "14px !important" }} />}
                                        label={`${plan.stores} ${plan.stores === 1 ? "tienda" : "tiendas"}`}
                                        size="small"
                                        sx={{
                                          fontSize: "0.72rem", height: 22,
                                          bgcolor: "action.hover",
                                          color: "text.secondary",
                                          border: "1px solid",
                                          borderColor: "divider",
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                  <Box sx={{ textAlign: "right" }}>
                                    <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: "primary.main" }}>
                                      ${plan.price}
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
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
                          sx={secondaryButtonSx}
                        >
                          Atrás
                        </CustomButton>
                        <CustomButton
                          onClick={handleSubmit}
                          disabled={isFormIncomplete || mutation.isPending}
                          fullWidth
                          sx={primaryButtonSx}
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
                          mb: 2, borderRadius: "10px", fontSize: "0.85rem",
                        }}>
                          {paymentResult.message}
                        </Alert>
                      )}
                      <Typography sx={{ fontSize: "0.85rem", color: "text.secondary", mb: 2 }}>
                        Se activará cobro recurrente de <strong style={{ color: "inherit" }}>${selectedPlan?.price} MXN/mes</strong> con tu tarjeta.
                      </Typography>
                      {paymentSubmitting && (
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                          <CircularProgress size={24} sx={{ color: "primary.main" }} />
                        </Box>
                      )}
                      <div id="mp-bricks-container" />
                      {!paymentSubmitting && (
                        <CustomButton
                          onClick={handleBackFromPayment}
                          startIcon={<ArrowBackIcon sx={{ fontSize: "16px !important" }} />}
                          sx={{ mt: 2, ...secondaryButtonSx }}
                        >
                          Atrás
                        </CustomButton>
                      )}
                    </Box>
                  )}

                  {!showPayment && (
                    <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", textAlign: "center", mt: 2.5 }}>
                      ¿Ya tienes una cuenta?{" "}
                      <Box
                        component="span"
                        sx={{
                          color: "primary.main",
                          fontWeight: 600,
                          cursor: "pointer",
                          "&:hover": { color: "primary.light" },
                        }}
                        onClick={() => router.push("/")}
                      >
                        Inicia sesión
                      </Box>
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </Paper>
      </Box>
    );
};

export default Registration;
