import React, { memo } from "react";
import { Chip, FormLabel } from "@mui/material";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import CustomButton from "../../ui/Button/Button";
import { usePrinterStatus } from "../../../hooks/usePrinterStatus";

/**
 * Botón de cobro de los modales de pago con el aviso "Con/Sin impresión de ticket"
 * y el estado de la impresora de la sucursal.
 *
 * Se monta dentro de un `CustomModal`, así que el estado de la impresora solo se
 * consulta mientras el modal está abierto. Con `compact` muestra solo el botón.
 */
const PaymentSubmitPanel = ({ printer, disabled, onSubmit, children, compact = false }) => {
  const { connected, error } = usePrinterStatus(printer);

  if (compact) {
    return (
      <CustomButton disabled={disabled} fullWidth onClick={onSubmit} startIcon={<MoneyOffIcon />}>
        {children}
      </CustomButton>
    );
  }

  return (
    <>
      <FormLabel sx={{ display: "block", textAlign: "center" }}>
        {printer ? "Con impresión de ticket" : "Sin impresión de ticket"}
      </FormLabel>
      <CustomButton disabled={disabled} fullWidth onClick={onSubmit} startIcon={<MoneyOffIcon />} sx={{ mt: 1 }}>
        {children}
      </CustomButton>
      {printer && (
        <Chip
          label={error || (connected ? "Impresora conectada" : "Impresora desconectada")}
          color={connected ? "success" : "error"}
          variant="filled"
          size="small"
          sx={{ mt: 1, width: "100%" }}
        />
      )}
    </>
  );
};

export default memo(PaymentSubmitPanel);
