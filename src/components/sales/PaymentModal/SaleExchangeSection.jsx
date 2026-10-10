import React from "react";
import { Grid, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CustomButton from "../../ui/Button/Button";
import { formatCurrency } from "../../../utils/currency";
import PaymentCard from "./PaymentCard";

/**
 * Intercambio de mercancía: busca la venta original por folio y muestra lo devuelto y lo que falta cobrar.
 */
const SaleExchangeSection = ({ hidden, saleExchange, onSaleIdChange, onSearch }) => (
  <PaymentCard hidden={hidden} title="Cambio de mercancia">
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          size="small"
          label="# Venta"
          type="number"
          value={saleExchange.id}
          onChange={(e) => onSaleIdChange(Number(e.target.value))}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <CustomButton fullWidth onClick={onSearch}>
          <SearchIcon /> Buscar
        </CustomButton>
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField fullWidth size="small" label="$ de devolución" value={formatCurrency(saleExchange.refunded)} disabled />
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField fullWidth size="small" label="Cobrar" value={formatCurrency(saleExchange.payment)} disabled />
      </Grid>
    </Grid>
  </PaymentCard>
);

export default SaleExchangeSection;
