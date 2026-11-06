import React from "react";
import CustomButton from "../../ui/Button/Button";

/** Métodos de pago de la venta; con pagos mixtos es un enlace que abre el detalle de cada pago. */
const PaymentsCell = ({ sale, onOpen }) => {
  const text = sale.payments_methods.join(", ");

  if (sale.payments_methods.length < 2) return text;

  return (
    <CustomButton
      variant="text"
      onClick={() => onOpen(sale)}
      sx={{ height: "auto", p: 0, textTransform: "none", textDecoration: "underline", color: "text.primary", fontWeight: 400 }}
    >
      {text}
    </CustomButton>
  );
};

export default PaymentsCell;
