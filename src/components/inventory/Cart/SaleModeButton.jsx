import React from "react";
import { IconButton } from "@mui/material";
import ScaleIcon from "@mui/icons-material/Scale";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { QUANTITY_MODES, getSaleModeLabel, isCustomSaleMode } from "./quantityRules";

const VARIANT_SX = {
  table: { borderRadius: "8px", px: 1, width: "auto", height: 28, fontSize: "0.7rem" },
  card: { borderRadius: "4px", px: 0.75, py: 0.4, fontSize: "0.6rem", width: "100%", justifyContent: "center" },
  mobile: { borderRadius: "8px", px: 1, fontSize: "0.75rem" },
};

const ICON_SX = { fontSize: 14, mr: 0.3 };

/**
 * Botón "Venta por" de un producto por kilo o litro: alterna Kilo/Litro → Fracción → Pesos.
 * `variant`: "table" (con ícono), "card" (ancho completo) o "mobile" (con prefijo "Venta por:").
 */
const SaleModeButton = ({ item, mode, onToggle, variant = "table" }) => {
  const active = isCustomSaleMode(mode);
  const label = getSaleModeLabel(item, mode);
  const Icon = mode === QUANTITY_MODES.AMOUNT ? AttachMoneyIcon : ScaleIcon;

  return (
    <IconButton
      size="small"
      onClick={() => onToggle(item)}
      sx={{
        border: "1px solid",
        borderColor: active ? "primary.main" : "divider",
        bgcolor: active ? "primary.main" : "transparent",
        color: active ? "primary.contrastText" : "text.secondary",
        fontWeight: 600,
        "&:hover": { bgcolor: active ? "primary.dark" : "action.hover" },
        ...VARIANT_SX[variant],
      }}
    >
      {variant === "table" && <Icon sx={ICON_SX} />}
      {variant === "mobile" ? `Venta por: ${label}` : label}
    </IconButton>
  );
};

export default SaleModeButton;
