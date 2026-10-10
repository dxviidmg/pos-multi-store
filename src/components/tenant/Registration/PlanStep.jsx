import React from "react";
import { Box, Typography, CircularProgress, Card, CardContent, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CustomButton from "../../ui/Button/Button";
import { formatCurrency } from "../../../utils/utils";
import { primaryButtonSx, secondaryButtonSx, getPlanCardSx } from "./Registration.styles";

const storesChipSx = {
  fontSize: "0.72rem", height: 22,
  bgcolor: "action.hover",
  color: "text.secondary",
  border: "1px solid",
  borderColor: "divider",
};

const PlanOption = ({ plan, selected, onSelect }) => (
  <Card onClick={() => onSelect(plan)} sx={getPlanCardSx(selected)}>
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
              sx={storesChipSx}
            />
          </Box>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: "primary.main" }}>
            {formatCurrency(plan.price)}
          </Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
            MXN/mes
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

/** Paso 3: elegir el plan y pasar al pago. */
const PlanStep = ({ plans, plansLoading, selectedPlan, onSelectPlan, onBack, onSubmit, submitDisabled, isSubmitting }) => (
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
          <PlanOption
            key={plan.id}
            plan={plan}
            selected={selectedPlan?.id === plan.id}
            onSelect={onSelectPlan}
          />
        ))}
      </Box>
    )}

    <Box sx={{ display: "flex", gap: 1.5, mt: 2.5 }}>
      <CustomButton
        onClick={onBack}
        startIcon={<ArrowBackIcon sx={{ fontSize: "16px !important" }} />}
        sx={secondaryButtonSx}
      >
        Atrás
      </CustomButton>
      <CustomButton
        onClick={onSubmit}
        disabled={submitDisabled}
        fullWidth
        sx={primaryButtonSx}
      >
        {isSubmitting ? "Creando cuenta..." : "Crear cuenta y pagar"}
      </CustomButton>
    </Box>
  </Box>
);

export default PlanStep;
