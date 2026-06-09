import React, { useEffect, useState } from "react";
import { getCurrentPlan, getPlanEquivalent } from "../../../api/plans";
import SubscriptionModal from "../SubscriptionModal/SubscriptionModal";
import { useModal } from "../../../hooks/useModal";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { Grid, Stack, Card, CardContent, Typography } from "@mui/material";
import CustomButton from "../../ui/Button/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const MyCurrentPlan = () => {
  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [equivalent, setEquivalent] = useState(null);
  const subscriptionModal = useModal();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getCurrentPlan();
      if (res.status === 200) {
        setPlan(res.data);
        if (res.data?.plan?.stores) {
          const eqRes = await getPlanEquivalent(res.data.plan.stores).catch(() => null);
          if (eqRes?.status === 200) setEquivalent(eqRes.data);
        }
      }
      setPlanLoading(false);
    };
    fetchData();
  }, []);

  const handleUpdateSubscriptionList = (updated) => {
    setPlan(updated);
  };

  const handleChangePlan = () => {
    console.log("Cambiar plan", equivalent);
  };

  return (
    <>
      <CustomSpinner isLoading={planLoading} />
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
            onClick={handleChangePlan}
            startIcon={<AddCircleIcon />}
            disabled={!equivalent}
          >
            Domiciliar
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
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Precio
                      </Typography>
                      <Typography variant="body1">
                        ${plan.plan.price} MXN/mes
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Sucursales
                      </Typography>
                      <Typography variant="body1">{plan.plan.stores}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
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
