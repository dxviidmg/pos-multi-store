import React from "react";
import { Grid, Typography } from "@mui/material";

const CARD_SX = { padding: "0.75rem !important", marginBottom: "1rem !important" };
const LAST_CARD_SX = { padding: "0.75rem !important" };

/**
 * Tarjeta de sección del cobro (cliente, intercambio, totales, medios de pago).
 * `last` quita el margen inferior; `hidden` la oculta sin desmontarla.
 */
const PaymentCard = ({ title, hidden, last = false, children }) => (
  <Grid item xs={12} className="card" hidden={hidden} sx={last ? LAST_CARD_SX : CARD_SX}>
    {title && <Typography sx={{ mb: 1, fontWeight: 700 }}>{title}</Typography>}
    {children}
  </Grid>
);

export default PaymentCard;
