import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import SendIcon from "@mui/icons-material/Send";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CustomButton from "../../ui/Button/Button";
import StoreSelect from "../../ui/StoreSelect/StoreSelect";
import ViewModeToggle from "../../ui/ViewModeToggle/ViewModeToggle";
import { MOVEMENT_TYPES } from "../../../constants";
import { formatCurrency } from "../../../utils/currency";
import { CART_VIEW_OPTIONS } from "./cartViewModes";

const VALUE_SX = { fontWeight: 700, color: "primary.main" };

const destinationLabel = (store) => <b>{store.name} ({store.store_type_display})</b>;
const confirmationLabel = (store) => `${store.name} (${store.store_type_display})`;

const ViewToggle = ({ value, onChange }) => (
  <Box sx={{ display: "flex", gap: 1 }}>
    <ViewModeToggle variant="buttons" value={value} onChange={onChange} options={CART_VIEW_OPTIONS} />
  </Box>
);

// `key` cambia con el valor para repetir la animación value-pop
const AnimatedValue = ({ value }) => (
  <Typography key={value} variant="h4" className="value-pop" sx={VALUE_SX}>{value}</Typography>
);

const ProductsCount = ({ totalProducts, showToggle, viewMode, onViewModeChange }) => (
  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
    {showToggle && <ViewToggle value={viewMode} onChange={onViewModeChange} />}
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Typography variant="body2" color="text.secondary">Productos:</Typography>
      <AnimatedValue value={totalProducts} />
    </Box>
  </Box>
);

/**
 * Encabezado del carrito: vista (escritorio), conteo, total y la acción del movimiento
 * (cobrar, transferir/distribuir con destino confirmado o agregar a inventario).
 */
const CartToolbar = ({
  movementType,
  isMobile,
  viewMode,
  onViewModeChange,
  totalProducts,
  total,
  onCharge,
  destination,
  onSubmitTransfer,
  onSubmitDistribution,
  onSubmitAddToStock,
}) => {
  const countProps = { totalProducts, showToggle: !isMobile, viewMode, onViewModeChange };
  const isTransfer = movementType === MOVEMENT_TYPES.TRANSFER;

  return (
    <Grid container spacing={1} sx={{ mb: 1, alignItems: "center" }}>
      {(movementType === MOVEMENT_TYPES.SALE || movementType === MOVEMENT_TYPES.RESERVATION) && (
        <>
          <Grid item xs={6} md={3}>
            <ProductsCount {...countProps} />
          </Grid>
          <Grid item xs={6} md={5}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">Total:</Typography>
              <AnimatedValue value={formatCurrency(total)} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomButton fullWidth onClick={onCharge} startIcon={<PaymentIcon />} sx={{ py: 1.2, fontSize: "0.875rem" }}>
              Cobrar (Ctrl+P)
            </CustomButton>
          </Grid>
        </>
      )}

      {(isTransfer || movementType === MOVEMENT_TYPES.DISTRIBUTION) && (
        <>
          <Grid item xs={12} md={3}>
            <ProductsCount {...countProps} />
          </Grid>
          <Grid item xs={12} md={3}>
            <StoreSelect
              value={destination.selectedStore}
              onChange={(e) => destination.setSelectedStore(e.target.value)}
              placeholder="Selecciona un destino"
              getOptionLabel={destinationLabel}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StoreSelect
              value={destination.confirmedStore}
              onChange={(e) => destination.setConfirmedStore(e.target.value)}
              placeholder="Confirma el destino"
              getOptionLabel={confirmationLabel}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomButton
              onClick={isTransfer ? onSubmitTransfer : onSubmitDistribution}
              disabled={!destination.isDestinationConfirmed}
              fullWidth
              startIcon={<SendIcon />}
            >
              {isTransfer ? "Transferir" : "Distribuir"}
            </CustomButton>
          </Grid>
        </>
      )}

      {movementType === MOVEMENT_TYPES.ADD_STOCK && (
        <>
          {!isMobile && (
            <Grid item md={1} sx={{ display: "flex", gap: 1, justifyContent: "flex-start", alignItems: "center" }}>
              <ViewModeToggle variant="buttons" value={viewMode} onChange={onViewModeChange} options={CART_VIEW_OPTIONS} />
            </Grid>
          )}
          <Grid item xs={12} md={8} />
          <Grid item xs={12} md={3}>
            <CustomButton fullWidth onClick={onSubmitAddToStock} startIcon={<AddCircleIcon />}>
              Agregar
            </CustomButton>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default CartToolbar;
