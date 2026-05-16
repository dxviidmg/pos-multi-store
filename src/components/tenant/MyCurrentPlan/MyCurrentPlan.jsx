import React, { useEffect, useState } from "react";
import { getCurrentPlan } from "../../../api/plans";
import { createMercadoPagoPreference } from "../../../api/mercadopago";
import SubscriptionModal from "../SubscriptionModal/SubscriptionModal";
import { useModal } from "../../../hooks/useModal";
import { useMercadoPago } from "../../../hooks/useMercadoPago";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { Grid, Stack, Card, CardContent, Typography } from "@mui/material";
import CustomButton from "../../ui/Button/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const MyCurrentPlan = () => {
  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [mpLoading, setMpLoading] = useState(false);
  const subscriptionModal = useModal();
  const { initMercadoPago, openCheckout } = useMercadoPago();

  useEffect(() => {
    const fetchPlan = async () => {
      const res = await getCurrentPlan();
      if (res.status === 200) {
        setPlan(res.data);
      }
      setPlanLoading(false);
    };
    fetchPlan();
    initMercadoPago();
  }, [initMercadoPago]);

  const handleUpdateSubscriptionList = (updated) => {
    setPlan(updated);
  };

  const handleMercadoPagoCheckout = async () => {
    setMpLoading(true);
    try {
      const response = await createMercadoPagoPreference(plan.plan.id);
      if (response.status === 201 && response.data.preference_id) {
        openCheckout(response.data.preference_id);
      } else {
        alert('Error al crear la preferencia de pago. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al procesar pago:', error);
      alert('Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setMpLoading(false);
    }
  };

  return (
    <>
      <CustomSpinner isLoading={planLoading || mpLoading} />
      <SubscriptionModal
        isOpen={subscriptionModal.isOpen}
        subscription={subscriptionModal.data}
        onClose={subscriptionModal.close}
        onUpdate={handleUpdateSubscriptionList}
      />

      <Grid item xs={12} className="card">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <h1>Mi Plan Actual</h1>
          <CustomButton
            onClick={handleMercadoPagoCheckout}
            startIcon={<AddCircleIcon />}
            disabled={mpLoading}
            loading={mpLoading}
          >
            Cambiar plan
          </CustomButton>
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
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        Precio
                      </Typography>
                      <Typography variant="body1">
                        ${plan.plan.price} MXN/mes
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        Sucursales
                      </Typography>
                      <Typography variant="body1">{plan.plan.stores}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        Almacenes
                      </Typography>
                      <Typography variant="body1">{plan.plan.storages}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        Facturación
                      </Typography>
                      <Typography variant="body1">
                        {plan.plan.billing_type_display}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Grid>
    </>
  );
};

export default MyCurrentPlan;
