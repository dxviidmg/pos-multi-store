import React from "react";
import { Checkbox, FormControlLabel, Grid, TextField } from "@mui/material";

/**
 * Costo, precios, mayoreo y "mayoreo con descuento de cliente" (como `Grid item`s).
 * `errors` viene de `getPriceErrors` (productValidation.js).
 */
const ProductPriceFields = ({ values, onChange, errors, disabled }) => (
  <>
    <Grid item xs={12} md={4}>
      <TextField size="small" fullWidth label="Costo" type="number"
        value={values.cost}
        placeholder="Costo"
        name="cost"
        onChange={onChange}
        disabled={disabled}
        error={!!errors.cost}
        helperText={errors.cost}
      />
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField size="small" fullWidth label="Precio unitario" type="number"
        value={values.unit_price}
        placeholder="Precio unitario"
        name="unit_price"
        onChange={onChange}
        disabled={disabled}
        error={!!errors.unitPrice}
        helperText={errors.unitPrice}
      />
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField size="small" fullWidth label="Precio mayoreo" type="number"
        value={values.wholesale_price}
        placeholder="Precio de mayoreo"
        name="wholesale_price"
        onChange={onChange}
        disabled={disabled}
        error={!!errors.wholesale}
        helperText={errors.wholesale}
      />
    </Grid>

    <Grid item xs={12} md={4}>
      <TextField size="small" fullWidth label="Cantidad mínima mayoreo" type="number"
        value={values.min_wholesale_quantity}
        placeholder="Cantidad mínima"
        name="min_wholesale_quantity"
        onChange={onChange}
        disabled={disabled}
        error={!!errors.minQty}
        helperText={errors.minQty}
      />
    </Grid>
    <Grid item xs={12} md={8} sx={{ display: "flex", alignItems: "center" }}>
      <FormControlLabel
        control={
          <Checkbox size="small"
            checked={values.wholesale_price_on_client_discount === true}
            onChange={onChange}
            name="wholesale_price_on_client_discount"
            disabled={disabled}
          />
        }
        label="Aplicar mayoreo aún con descuento de cliente"
      />
    </Grid>
  </>
);

export default ProductPriceFields;
