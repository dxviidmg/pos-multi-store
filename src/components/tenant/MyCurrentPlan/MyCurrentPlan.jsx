import React, { useEffect, useState } from "react";
import { getCurrentPlan, getPlanEquivalent } from "../../../api/plans";
import { createSubscription, updateSubscriptionCard } from "../../../api/subscriptions";
import { getTenantDates } from "../../../api/tenants";
import { useCardFormModal } from "../../../hooks/useCardFormModal";
import { useModal } from "../../../hooks/useModal";
import { useUser } from "../../../context/UserContext";
import { isOwner as isOwnerUser } from "../../../constants/routeAccess";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { Grid, Typography, Box, Button, Alert } from "@mui/material";
import { showRequestError, showSuccess } from "../../../utils/alerts";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { logger } from "../../../utils/logger";
import { formatLongDate } from "../../../utils/date";
import PlanCard from "./PlanCard";
import SubscribeModal, { SUBSCRIBE_CONTAINER_ID } from "./SubscribeModal";
import UpdateCardModal, { UPDATE_CARD_CONTAINER_ID } from "./UpdateCardModal";
import CancelSubscriptionModal from "./CancelSubscriptionModal";

const TENANT_DATE_FIELDS = [
  { key: "tenant_created_at", label: "Fecha de creación" },
  { key: "active_subscription_date", label: "Suscripción activa desde" },
  { key: "first_payment_date", label: "Primer pago" },
];

const getSubscribeErrorMessage = (err) =>
  err.response?.data?.detail || err.response?.data?.error || "Error al procesar la suscripción.";

const getUpdateCardErrorMessage = (err) => {
  const status = err.response?.status;
  const detail = err.response?.data?.detail;
  if (status === 500) return "Ocurrió un problema al actualizar la tarjeta. Contacta a soporte técnico.";
  if (status === 404) return detail || "No hay una suscripción activa para actualizar.";
  return detail || "No se pudo actualizar la tarjeta. Intenta de nuevo o contacta a soporte.";
};

const MyCurrentPlan = () => {
  const { user } = useUser();
  const isOwner = isOwnerUser(user);
  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [equivalent, setEquivalent] = useState(null);
  const [tenantDates, setTenantDates] = useState(null);
  const [showCancelSection, setShowCancelSection] = useState(false);

  const cancelModal = useModal();
  const amount = equivalent?.price || plan?.plan?.price;

  const subscribeForm = useCardFormModal({
    containerId: SUBSCRIBE_CONTAINER_ID,
    amount,
    submit: ({ token, email, payment_method_id, issuer_id, installments }) =>
      createSubscription({
        plan_id: equivalent?.id || plan.plan.id,
        card_token: token,
        payer_email: email,
        payment_method_id,
        issuer_id,
        installments,
      }),
    onSuccess: () => {
      setPlan((prev) => ({ ...prev, plan: equivalent, has_plan: true }));
      setEquivalent(null);
      showSuccess("Suscripción activada");
    },
    getErrorMessage: getSubscribeErrorMessage,
  });

  const updateCardForm = useCardFormModal({
    containerId: UPDATE_CARD_CONTAINER_ID,
    amount,
    submit: ({ token, payment_method_id }) =>
      updateSubscriptionCard({ card_token: token, payment_method_id }),
    onSuccess: () =>
      showSuccess("Tarjeta actualizada. Los datos de la nueva tarjeta se reflejarán en tu próximo pago."),
    getErrorMessage: getUpdateCardErrorMessage,
  });

  const isSubscription = plan?.plan?.billing_type === "S";
  const isActive = plan?.subscription_status === "active";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCurrentPlan();
        setPlan(res.data);
        if (res.data?.plan?.stores) {
          const eqRes = await getPlanEquivalent().catch(() => null);
          if (eqRes) setEquivalent(eqRes.data);
        }
      } catch (error) {
        showRequestError("cargar tu plan", error);
      } finally {
        setPlanLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await getTenantDates();
        setTenantDates(res.data);
      } catch (err) {
        logger.error("Error fetching tenant dates:", err);
        setTenantDates({});
      }
    };
    fetchDates();
  }, []);

  return (
    <>
      <CustomSpinner isLoading={planLoading || subscribeForm.submitting} />

      {user?.access_blocked && (
        <Grid item xs={12} className="card">
          <Alert severity="warning" sx={{ mb: 2 }}>
            El acceso a tu negocio está suspendido porque tu suscripción venció
            {user?.access_until ? ` el ${formatLongDate(user.access_until)}` : ""}
            . Renueva tu plan para reactivar el acceso completo.
          </Alert>
        </Grid>
      )}

      <PlanCard
        plan={plan}
        equivalent={equivalent}
        planLoading={planLoading}
        isOwner={isOwner}
        hasAccess={!user?.access_blocked}
        onSubscribe={subscribeForm.open}
        onUpdateCard={updateCardForm.open}
      />

      <Grid item xs={12} className="card" sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarTodayIcon fontSize="small" /> Fechas del negocio
        </Typography>
        {tenantDates ? (
          <Grid container spacing={3}>
            {TENANT_DATE_FIELDS.map(({ key, label }) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Typography variant="body2" color="textSecondary">{label}</Typography>
                <Typography variant="body1">{formatLongDate(tenantDates[key], { withTime: true })}</Typography>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="textSecondary">Cargando fechas...</Typography>
        )}
      </Grid>

      {isOwner && isSubscription && isActive && (
        <Grid item xs={12} className="card" sx={{ mt: 3 }}>
          <Box sx={{ textAlign: "center" }}>
            {!showCancelSection ? (
              <Typography
                variant="caption"
                onClick={() => setShowCancelSection(true)}
                sx={{
                  color: "text.disabled",
                  cursor: "pointer",
                  textDecoration: "underline",
                  "&:hover": { color: "text.secondary" },
                }}
              >
                ¿Necesitas dar de baja tu suscripción?
              </Typography>
            ) : (
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1.5 }}>
                  Se detendrá el cobro recurrente. Conservarás acceso hasta el final de
                  tu periodo pagado.
                </Typography>
                <Button onClick={() => cancelModal.open()} variant="text" color="error" size="small">
                  Cancelar suscripción
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      )}

      <SubscribeModal cardForm={subscribeForm} equivalent={equivalent} />
      <CancelSubscriptionModal isOpen={cancelModal.isOpen} onClose={cancelModal.close} />
      <UpdateCardModal cardForm={updateCardForm} />
    </>
  );
};

export default MyCurrentPlan;
