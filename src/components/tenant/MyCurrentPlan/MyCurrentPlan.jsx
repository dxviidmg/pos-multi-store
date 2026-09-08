import React, { useEffect, useState, useCallback } from "react";
import { getCurrentPlan, getPlanEquivalent } from "../../../api/plans";
import { createSubscription, cancelSubscription } from "../../../api/subscriptions";
import { useMercadoPago } from "../../../hooks/useMercadoPago";
import { useModal } from "../../../hooks/useModal";
import { useUser } from "../../../context/UserContext";
import { CANCELLATION_REASONS } from "../../../constants";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { Grid, Stack, Card, CardContent, Typography, Box, Chip, Button, Alert, TextField, MenuItem } from "@mui/material";
import { showSuccess } from "../../../utils/alerts";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import httpClient from "../../../api/httpClient";
import { getApiUrl } from "../../../api/utils";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const MyCurrentPlan = () => {
  const { user } = useUser();
  const isOwner = user?.role === "owner";
  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [equivalent, setEquivalent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [tenantDates, setTenantDates] = useState(null);

  // Estado de cancelación
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelResult, setCancelResult] = useState(null);
  const [accessUntil, setAccessUntil] = useState(null);
  const [showCancelSection, setShowCancelSection] = useState(false);

  const paymentModal = useModal();
  const cancelModal = useModal();
  const { createCardForm, unmountCardForm } = useMercadoPago();

  const isCancelled = plan?.subscription_status === "cancelled";
  const isSubscription = plan?.plan?.billing_type === "S";

  useEffect(() => {
    const fetchData = async () => {
      const res = await getCurrentPlan();
      if (res.status === 200) {
        setPlan(res.data);
        if (res.data?.plan?.stores) {
          const eqRes = await getPlanEquivalent(res.data.plan.id).catch(() => null);
          if (eqRes?.status === 200) setEquivalent(eqRes.data);
        }
      }
      setPlanLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await httpClient.get(getApiUrl("tenant-dates"));
        if (res.status === 200) setTenantDates(res.data);
      } catch (err) {
        console.error("Error fetching tenant dates:", err);
      }
    };
    fetchDates();
  }, []);

  const handleOpenPayment = useCallback(() => {
    setResult(null);
    paymentModal.open();
    setTimeout(() => {
      createCardForm({
        amount: equivalent?.price || plan?.plan?.price,
        onSubmit: async ({ token, email, payment_method_id, issuer_id, installments }) => {
          setSubmitting(true);
          try {
            const res = await createSubscription({
              plan_id: equivalent?.id || plan.plan.id,
              card_token: token,
              payer_email: email,
              payment_method_id,
              issuer_id,
              installments,
            });
            if (res.status === 201 || res.status === 200) {
              unmountCardForm();
              paymentModal.close();
              setPlan((prev) => ({ ...prev, plan: equivalent, has_plan: true }));
              setEquivalent(null);
              showSuccess("¡Suscripción activada exitosamente!");
            } else {
              setResult({ success: false, message: "Error al crear la suscripción." });
            }
          } catch (err) {
            const msg = err.response?.data?.detail || err.response?.data?.error || "Error al procesar la suscripción.";
            setResult({ success: false, message: msg });
          } finally {
            setSubmitting(false);
          }
        },
        onError: () => {
          setResult({ success: false, message: "Error en el formulario de pago." });
        },
      });
    }, 100);
  }, [equivalent, plan, paymentModal, createCardForm, unmountCardForm]);

  const handleClosePayment = () => {
    unmountCardForm();
    setResult(null);
    paymentModal.close();
  };

  const handleOpenCancel = () => {
    setCancelReason("");
    setCancelResult(null);
    cancelModal.open();
  };

  const handleCloseCancel = () => {
    if (cancelling) return;
    setCancelResult(null);
    cancelModal.close();
  };

  const handleCancelSubscription = async () => {
    if (!cancelReason) return;
    setCancelling(true);
    setCancelResult(null);
    try {
      const res = await cancelSubscription({ reason: cancelReason });
      if (res.status === 200 || res.status === 201) {
        setAccessUntil(res.data?.access_until ?? null);
        setPlan((prev) => ({ ...prev, subscription_status: "cancelled" }));
        cancelModal.close();
        showSuccess("Tu suscripción fue cancelada. Tendrás acceso hasta el final de tu periodo pagado.");
      } else {
        setCancelResult({ success: false, message: "No se pudo cancelar la suscripción." });
      }
    } catch (err) {
      const status = err.response?.status;
      let msg = err.response?.data?.detail;
      if (status === 500) {
        msg = "Ocurrió un problema al procesar la cancelación. Contacta a soporte técnico.";
      } else if (!msg) {
        msg = "No se pudo cancelar la suscripción. Intenta de nuevo o contacta a soporte.";
      }
      setCancelResult({ success: false, message: msg });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <CustomSpinner isLoading={planLoading || submitting || cancelling} />

      {user?.access_blocked && (
        <Grid item xs={12} className="card">
          <Alert severity="warning" sx={{ mb: 2 }}>
            El acceso a tu negocio está suspendido porque tu suscripción venció
            {user?.access_until
              ? ` el ${new Date(user.access_until).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}`
              : ""}
            . Renueva tu plan para reactivar el acceso completo.
          </Alert>
        </Grid>
      )}

      <Grid item xs={12} className="card">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <h1>Mi Plan Actual</h1>
          {plan?.plan?.billing_type === "S" ? (
            <Chip icon={<CheckCircleIcon />} label="Domiciliación activada" color="success" variant="filled" />
          ) : equivalent ? (
            <Button
              onClick={handleOpenPayment}
              startIcon={<AddCircleIcon />}
              variant="contained"
              color="success"
              size="small"
              sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
            >
              Domiciliar (Ahorra ${plan.plan.price - equivalent.price} MXN/mes)
            </Button>
          ) : null}
        </Stack>

        {!planLoading && !plan?.has_plan ? (
          <Typography variant="body1" color="textSecondary" sx={{ p: 2 }}>
            No hay un plan asignado. Por favor, contáctenos para asignar un plan.
          </Typography>
        ) : (
          <>
            {plan?.has_plan && (
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Plan Actual: {plan.plan.name}
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="body2" color="textSecondary">Precio</Typography>
                      <Typography variant="body1">${plan.plan.price} MXN/mes</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="body2" color="textSecondary">Sucursales</Typography>
                      <Typography variant="body1">{plan.plan.stores}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="body2" color="textSecondary">Facturación</Typography>
                      <Typography variant="body1">{plan.plan.billing_type_display}</Typography>
                    </Grid>
                  </Grid>

                  {isSubscription && isCancelled && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Tu suscripción está cancelada. Conservas acceso
                      {accessUntil
                        ? ` hasta el ${new Date(accessUntil).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}`
                        : " hasta el final de tu periodo pagado"}
                      . Para reactivarla, contacta a soporte.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Grid>

      <Grid item xs={12} className="card" sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayIcon fontSize="small" /> Fechas del Negocio
            </Typography>
            {tenantDates ? (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="textSecondary">Fecha de creación</Typography>
                  <Typography variant="body1">
                    {tenantDates.tenant_created_at
                      ? new Date(tenantDates.tenant_created_at).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })
                      : "—"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="textSecondary">Suscripción activa desde</Typography>
                  <Typography variant="body1">
                    {tenantDates.active_subscription_date
                      ? new Date(tenantDates.active_subscription_date).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })
                      : "—"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="textSecondary">Primer pago</Typography>
                  <Typography variant="body1">
                    {tenantDates.first_payment_date
                      ? new Date(tenantDates.first_payment_date).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })
                      : "—"}
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body2" color="textSecondary">Cargando fechas...</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {isOwner && isSubscription && !isCancelled && (
        <Grid item xs={12} className="card" sx={{ mt: 3 }}>
          <Box sx={{ textAlign: "center", py: 1 }}>
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
                <Button
                  onClick={handleOpenCancel}
                  variant="text"
                  color="error"
                  size="small"
                >
                  Cancelar suscripción
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      )}

      <CustomModal showOut={paymentModal.isOpen} onClose={handleClosePayment} title="Domiciliar pago recurrente">
        <Box sx={{ p: 3 }}>
          {result && (
            <Alert severity={result.success ? "success" : "error"} sx={{ mb: 2 }}>
              {result.message}
            </Alert>
          )}
          {equivalent && !result?.success && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Se activará cobro recurrente de <strong>${equivalent.price} MXN/mes</strong>
            </Typography>
          )}
          <div id="mp-bricks-container" />
        </Box>
      </CustomModal>

      <CustomModal showOut={cancelModal.isOpen} onClose={handleCloseCancel} title="Cancelar suscripción">
        <Box sx={{ p: 3 }}>
          {cancelResult && !cancelResult.success && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {cancelResult.message}
            </Alert>
          )}

          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Al cancelar, se detendrá el cobro recurrente. Conservarás acceso hasta el
            final de tu periodo ya pagado. No se generan reembolsos y, para reactivar
            la suscripción más adelante, deberás contactar a soporte.
          </Typography>

          <TextField
            select
            fullWidth
            size="small"
            label="Motivo de cancelación"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            required
            sx={{ mb: 3 }}
          >
            {CANCELLATION_REASONS.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <CustomButton
              onClick={handleCloseCancel}
              disabled={cancelling}
              variant="outlined"
            >
              No, mantener
            </CustomButton>
            <Button
              onClick={handleCancelSubscription}
              disabled={!cancelReason || cancelling}
              variant="contained"
              color="error"
            >
              {cancelling ? "Cancelando..." : "Sí, cancelar"}
            </Button>
          </Stack>
        </Box>
      </CustomModal>
    </>
  );
};

export default MyCurrentPlan;
