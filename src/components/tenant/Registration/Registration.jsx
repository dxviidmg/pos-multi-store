import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateTenant } from "../../../hooks/useRegistration";
import { useMercadoPago } from "../../../hooks/useMercadoPago";
import AuthLayout from "../../layout/AuthLayout/AuthLayout";
import CustomButton from "../../ui/Button/Button";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { checkTenantExists, getAvailablePlans } from "../../../api/registration";
import { formatCurrency } from "../../../utils/utils";
import { secondaryButtonSx } from "./Registration.styles";
import RegistrationSuccess from "./RegistrationSuccess";
import BusinessStep from "./BusinessStep";
import OwnerStep from "./OwnerStep";
import PlanStep from "./PlanStep";

const INITIAL_FORM_DATA = {
  name: "",
  short_name: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
};

const STEP_LABELS = ["Negocio", "Propietario", "Plan"];
const PLAN_STEP = 2;
const SHORT_NAME_DEBOUNCE_MS = 500;

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [registered, setRegistered] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [shortNameStatus, setShortNameStatus] = useState(null);
  const [ownerUsername, setOwnerUsername] = useState("");

  // Selección de plan
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Pago
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const { createCardForm, unmountCardForm } = useMercadoPago();

  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  // Carga los planes al llegar al paso 3
  useEffect(() => {
    if (activeStep === PLAN_STEP && plans.length === 0) {
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

  // Verifica la disponibilidad de la clave con debounce; ignora respuestas obsoletas.
  useEffect(() => {
    const value = formData.short_name.trim();
    if (!value) {
      setShortNameStatus(null);
      return undefined;
    }

    let ignore = false;
    setShortNameStatus("checking");
    const timer = setTimeout(async () => {
      try {
        const data = await checkTenantExists(value);
        if (!ignore) setShortNameStatus(data.exists ? "taken" : "available");
      } catch {
        if (!ignore) setShortNameStatus(null);
      }
    }, SHORT_NAME_DEBOUNCE_MS);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [formData.short_name]);

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
      setPaymentError(error.response?.data?.detail || error.response?.data?.error || "Error al crear la cuenta.");
      // Vuelve a montar el formulario de pago para reintentar
      unmountCardForm();
      mountPaymentForm();
    },
  });

  // Monta el formulario de Mercado Pago; el negocio se crea solo al enviar la tarjeta.
  const mountPaymentForm = () => {
    setTimeout(() => {
      createCardForm({
        amount: selectedPlan.price,
        onSubmit: ({ token, email, payment_method_id, issuer_id, installments }) => {
          setPaymentSubmitting(true);
          setPaymentError(null);
          createTenantMutation.mutate({
            ...formData,
            plan_id: selectedPlan?.id,
            card_token: token,
            payer_email: email,
            payment_method_id,
            issuer_id,
            installments,
          });
        },
        onError: () => setPaymentError("Error en el formulario de pago."),
      });
    }, 100);
  };

  const setField = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleChange = useCallback((e) => setField(e.target.name, e.target.value), [setField]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPaymentError(null);
    setShowPayment(true);
    mountPaymentForm();
  };

  const handleBackFromPayment = () => {
    unmountCardForm();
    setShowPayment(false);
    setPaymentError(null);
  };

  const goToLogin = () => navigate("/login");

  const isStep1Valid = formData.name && formData.short_name && shortNameStatus === "available";
  const isStep2Valid = formData.first_name && formData.email && formData.phone_number;
  const isFormIncomplete = !isStep1Valid || !isStep2Valid || !selectedPlan;

  return (
    <AuthLayout
      headline="Crear tu negocio"
      subtitle="Punto de venta multi-tienda para vender, controlar inventario y traspasar producto."
      activeStep={activeStep}
      stepLabels={STEP_LABELS}
    >
      <Box sx={{ width: "100%", maxWidth: 440 }}>
        {registered ? (
          <RegistrationSuccess
            ownerUsername={ownerUsername}
            onLogin={goToLogin}
            onRegisterAnother={() => { setRegistered(false); setActiveStep(0); }}
          />
        ) : (
          <>
            <Box sx={{ px: 4, pt: 2.5, pb: 2.5 }}>
              {activeStep === 0 && (
                <BusinessStep
                  formData={formData}
                  setField={setField}
                  shortNameStatus={shortNameStatus}
                  isValid={isStep1Valid}
                  onNext={() => setActiveStep(1)}
                />
              )}

              {activeStep === 1 && (
                <OwnerStep
                  formData={formData}
                  onChange={handleChange}
                  isValid={isStep2Valid}
                  onBack={() => setActiveStep(0)}
                  onNext={() => setActiveStep(PLAN_STEP)}
                />
              )}

              {activeStep === PLAN_STEP && !showPayment && (
                <PlanStep
                  plans={plans}
                  plansLoading={plansLoading}
                  selectedPlan={selectedPlan}
                  onSelectPlan={setSelectedPlan}
                  onBack={() => setActiveStep(1)}
                  onSubmit={handleSubmit}
                  submitDisabled={isFormIncomplete || createTenantMutation.isPending}
                  isSubmitting={createTenantMutation.isPending}
                />
              )}

              {showPayment && (
                <Box>
                  {paymentError && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: "10px", fontSize: "0.85rem" }}>
                      {paymentError}
                    </Alert>
                  )}
                  <Typography sx={{ fontSize: "0.85rem", color: "text.secondary", mb: 2 }}>
                    Se activará cobro recurrente de{" "}
                    <Box component="strong" sx={{ color: "inherit" }}>{formatCurrency(selectedPlan?.price)} MXN/mes</Box>{" "}
                    con tu tarjeta.
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
                    onClick={goToLogin}
                  >
                    Inicia sesión
                  </Box>
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>
    </AuthLayout>
  );
};

export default Registration;
