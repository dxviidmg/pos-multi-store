import React, { memo } from "react";
import { Chip, FormLabel } from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { colors } from "../../../theme/colors";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import CustomButton from "../../ui/Button/Button";
import { usePrinterStatus } from "../../../hooks/usePrinterStatus";

// El tema pinta todo botón "contained" de navy; el de confirmar cobro va en verde
const CONFIRM_SX = {
  background: colors.confirm,
  "&:hover": { background: darken(colors.confirm, 0.15) },
};

// Estado de la impresora: etiqueta suave con punto, distinta al botón sólido de cobro
const printerChipSx = (connected) => (theme) => {
  const color = connected ? colors.confirm : theme.palette.error.main;
  return {
    width: "100%",
    bgcolor: alpha(color, 0.1),
    color,
    border: "1px solid",
    borderColor: alpha(color, 0.4),
    fontWeight: 600,
    "& .MuiChip-icon": { color: "inherit", fontSize: 10 },
  };
};

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
      <CustomButton color="success" disabled={disabled} fullWidth onClick={onSubmit} startIcon={<MoneyOffIcon />} sx={CONFIRM_SX}>
        {children}
      </CustomButton>
    );
  }

  return (
    <>
      <FormLabel sx={{ display: "block", textAlign: "center" }}>
        {printer ? "Con impresión de ticket" : "Sin impresión de ticket"}
      </FormLabel>
      <CustomButton color="success" disabled={disabled} fullWidth onClick={onSubmit} startIcon={<MoneyOffIcon />} sx={{ ...CONFIRM_SX, mt: 1 }}>
        {children}
      </CustomButton>
      {printer && (
        <Chip
          icon={<FiberManualRecordIcon />}
          label={error || (connected ? "Impresora conectada" : "Impresora desconectada")}
          size="small"
          sx={[printerChipSx(connected), { mt: 1.5 }]}
        />
      )}
    </>
  );
};

export default memo(PaymentSubmitPanel);
