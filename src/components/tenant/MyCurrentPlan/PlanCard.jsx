import React from "react";
import { Grid, Typography, Box, Chip, Button, Alert } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PageHeader from "../../ui/PageHeader";
import { colors } from "../../../theme/colors";
import { formatCurrency } from "../../../utils/utils";

/** La tarjeta caduca pronto si vence en menos de 2 meses. `expiration` viene como "MM/AA". */
const isCardExpiringSoon = (card) => {
  if (!card?.expiration) return false;
  const [mm, yy] = card.expiration.split("/").map((v) => parseInt(v, 10));
  if (!mm || Number.isNaN(yy)) return false;
  // La tarjeta es válida hasta el último día del mes de expiración.
  const expiryEnd = new Date(2000 + yy, mm, 1); // primer día del mes siguiente
  const now = new Date();
  const twoMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());
  return expiryEnd <= twoMonthsFromNow;
};

const formatCardBrand = (brand) => (brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : "Tarjeta");

const PlanDetail = ({ label, children }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Typography variant="body2" color="textSecondary">{label}</Typography>
    {children}
  </Grid>
);

/**
 * Tarjeta "Mi plan actual": datos del plan, tarjeta domiciliada y avisos de la suscripción.
 */
const PlanCard = ({ plan, equivalent, planLoading, isOwner, hasAccess, onSubscribe, onUpdateCard }) => {
  const subscriptionStatus = plan?.subscription_status;
  const isCancelled = subscriptionStatus === "cancelled";
  const isExpired = subscriptionStatus === "expired";
  const isSubscription = plan?.plan?.billing_type === "S";
  const currentCard = plan?.current_card;

  // Con access_until en el futuro el cliente sigue con acceso (aviso preventivo).
  // Sin acceso, "expired" significa que MP ya canceló y debe reactivar creando suscripción.
  const expiredWithAccess = isExpired && hasAccess;
  const expiredWithoutAccess = isExpired && !hasAccess;

  return (
    <Grid item xs={12} className="card">
      <PageHeader title="Mi plan actual" childrenMd="auto">
        {isSubscription ? (
          <Chip icon={<CheckCircleIcon />} label="Domiciliación activada" color="success" variant="filled" />
        ) : isOwner && equivalent ? (
          <Button
            onClick={onSubscribe}
            startIcon={<AddCircleIcon />}
            variant="contained"
            color="success"
            size="small"
            sx={{ bgcolor: "success.main", "&:hover": { bgcolor: "success.dark" } }}
          >
            Domiciliar (Ahorra {formatCurrency(plan.plan.price - equivalent.price)} MXN/mes)
          </Button>
        ) : null}
      </PageHeader>

      {!planLoading && !plan?.has_plan ? (
        <Typography variant="body1" color="textSecondary" sx={{ p: 2 }}>
          No hay un plan asignado. Por favor, contáctenos para asignar un plan.
        </Typography>
      ) : (
        plan?.has_plan && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Plan actual: {plan.plan.name}
            </Typography>
            <Grid container spacing={3}>
              <PlanDetail label="Precio">
                <Typography variant="body1">{formatCurrency(plan.plan.price)} MXN/mes</Typography>
              </PlanDetail>
              <PlanDetail label="Sucursales">
                <Typography variant="body1">{plan.plan.stores}</Typography>
              </PlanDetail>
              <PlanDetail label="Facturación">
                <Typography variant="body1">{plan.plan.billing_type_display}</Typography>
              </PlanDetail>
              {isSubscription && currentCard && (
                <PlanDetail label="Tarjeta">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <CreditCardIcon fontSize="small" color="action" />
                    <Typography variant="body1">
                      {formatCardBrand(currentCard.brand)}{" "}
                      •••• {currentCard.last_four}
                      {currentCard.expiration ? ` — vence ${currentCard.expiration}` : ""}
                    </Typography>
                  </Box>
                </PlanDetail>
              )}
            </Grid>

            {isSubscription && isCardExpiringSoon(currentCard) && (
              <Alert
                severity="warning"
                icon={<CreditCardIcon />}
                sx={{ mt: 2, alignItems: "center" }}
                action={
                  isOwner && (
                    <Button
                      onClick={onUpdateCard}
                      variant="contained"
                      size="small"
                      sx={{
                        whiteSpace: "nowrap",
                        background: colors.gradient.brand,
                        "&:hover": { background: colors.gradient.brandHover },
                      }}
                    >
                      Cambiar tarjeta
                    </Button>
                  )
                }
              >
                <strong>Tu tarjeta vence pronto</strong> (en menos de 2 meses).
                Actualízala para evitar que el cobro falle.
              </Alert>
            )}

            {isSubscription && isCancelled && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Tu suscripción está cancelada. Para reactivarla, contacta a soporte.
              </Alert>
            )}

            {isSubscription && expiredWithAccess && (
              <Alert
                severity="warning"
                sx={{ mt: 2 }}
                action={
                  isOwner && (
                    <Button color="inherit" size="small" onClick={onUpdateCard}>
                      Actualizar tarjeta
                    </Button>
                  )
                }
              >
                Tu tarjeta venció o el cobro falló. Actualízala para seguir usando el
                sistema sin interrupciones. Todavía tienes acceso, pero se suspenderá
                cuando termine tu vigencia.
              </Alert>
            )}

            {isSubscription && expiredWithoutAccess && (
              <Alert
                severity="error"
                sx={{ mt: 2 }}
                action={
                  isOwner && (
                    <Button color="inherit" size="small" onClick={onSubscribe}>
                      Reactivar
                    </Button>
                  )
                }
              >
                Tu suscripción venció y se detuvo el acceso. Reactívala registrando una
                tarjeta para volver a usar el sistema.
              </Alert>
            )}
          </Box>
        )
      )}
    </Grid>
  );
};

export default PlanCard;
