import React, { useEffect, useState, useCallback } from "react";
import { getCurrentPlan, getPlanEquivalent } from "../../../api/plans";
import { createSubscription } from "../../../api/subscriptions";
import { useMercadoPago } from "../../../hooks/useMercadoPago";
import { useModal } from "../../../hooks/useModal";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { Grid, Stack, Card, CardContent, Typography, Alert, Box, Snackbar, Chip, Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const MyCurrentPlan = () => {
  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [equivalent, setEquivalent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [successAlert, setSuccessAlert] = useState(false);
  const paymentModal = useModal();
  const { createCardForm, unmountCardForm } = useMercadoPago();

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

  const handleOpenPayment = useCallback(() => {
    setResult(null);
    paymentModal.open();
    setTimeout(() => {
      createCardForm({
        amount: equivalent?.price || plan?.plan?.price,
        onSubmit: async ({ token, email }) => {
          setSubmitting(true);
          try {
            const res = await createSubscription({
              plan_id: equivalent?.id || plan.plan.id,
              card_token_id: token,
              payer_email: email,
            });
            if (res.status === 201 || res.status === 200) {
              unmountCardForm();
              paymentModal.close();
              setPlan((prev) => ({ ...prev, plan: equivalent, has_plan: true }));
              setEquivalent(null);
              setSuccessAlert(true);
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

  return (
    <>
      <CustomSpinner isLoading={planLoading || submitting} />

      <Grid item xs={12} className="card">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <h1>Mi Plan Actual</h1>
          {plan?.plan?.billing_type === "subscription" ? (
            <Chip icon={<CheckCircleIcon />} label="Domiciliación activada" color="success" variant="outlined" />
          ) : equivalent ? (
            <Button
              onClick={handleOpenPayment}
              startIcon={<AddCircleIcon />}
              variant="contained"
              color="success"
              size="small"
              sx={{ background: '#2e7d32 !important', '&:hover': { background: '#1b5e20 !important' } }}
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
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Grid>

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

      <Snackbar open={successAlert} autoHideDuration={4000} onClose={() => setSuccessAlert(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="success" onClose={() => setSuccessAlert(false)}>¡Suscripción activada exitosamente!</Alert>
      </Snackbar>
    </>
  );
};

export default MyCurrentPlan;
