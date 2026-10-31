import React, { useEffect, useMemo } from "react";
import { Box, Typography, CircularProgress, Slider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomButton from "../../ui/Button/Button";
import { formatCurrency } from "../../../utils/utils";
import { primaryButtonSx, secondaryButtonSx } from "./Registration.styles";

const storesLabel = (stores) => `${stores} ${stores === 1 ? "tienda" : "tiendas"}`;

const StoresPicker = ({ plans, selectedPlan, onSelect }) => {
  const sorted = useMemo(() => [...plans].sort((a, b) => a.stores - b.stores), [plans]);
  const index = sorted.findIndex((plan) => plan.id === selectedPlan?.id);

  useEffect(() => {
    if (!selectedPlan) onSelect(sorted[0]);
  }, [selectedPlan, sorted, onSelect]);

  return (
  <Box>
    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "text.secondary", mb: 1 }}>
      ¿Cuántas tiendas tienes?
    </Typography>
    <Box sx={{ px: 2 }}>
      <Slider
        value={Math.max(index, 0)}
        min={0}
        max={sorted.length - 1}
        step={1}
        marks={sorted.map((plan, i) => ({ value: i, label: plan.stores }))}
        onChange={(_, value) => onSelect(sorted[value])}
        sx={{ "& .MuiSlider-markLabel": { fontSize: "0.8rem", fontWeight: 600 } }}
      />
    </Box>
    {selectedPlan && (
      <Box sx={{ textAlign: "center", mt: 2, py: 2, borderRadius: "12px", bgcolor: "action.hover" }}>
        <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
          Plan para {storesLabel(selectedPlan.stores)}
        </Typography>
        <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "primary.main" }}>
          {formatCurrency(selectedPlan.price)}
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>MXN/mes</Typography>
      </Box>
    )}
  </Box>
  );
};

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
      <StoresPicker plans={plans} selectedPlan={selectedPlan} onSelect={onSelectPlan} />
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
