import React from "react";
import { Button } from "@mui/material";

/** Métodos de pago de la venta; con pagos mixtos es un enlace que abre el detalle de cada pago. */
const PaymentsCell = ({ sale, onOpen }) => {
  const text = sale.payments_methods.join(", ");

  if (sale.payments_methods.length < 2) return text;

  return (
    <Button
      size="small"
      onClick={() => onOpen(sale)}
      sx={{ minWidth: 0, p: 0, textTransform: "none", textDecoration: "underline", color: "text.primary", fontWeight: 400 }}
    >
      {text}
    </Button>
  );
};

export default PaymentsCell;
