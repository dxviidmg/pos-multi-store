import { Chip } from "@mui/material";
import { STATUS_TONES } from "../../constants";

// Mapa de palabras de estado (texto de UI) → tono. Fuente única para no repetir
// mapas estado→color por pantalla. Agrega aquí nuevos estados en vez de ternarios.
const LABEL_TONES = {
  Exitoso: STATUS_TONES.SUCCESS,
  Aplicado: STATUS_TONES.SUCCESS,
  Conectado: STATUS_TONES.SUCCESS,
  Activo: STATUS_TONES.SUCCESS,
  Pendiente: STATUS_TONES.WARNING,
  Error: STATUS_TONES.ERROR,
  Desconectado: STATUS_TONES.ERROR,
  Cancelado: STATUS_TONES.ERROR,
};

/**
 * Pastilla de estado estándar (variante filled, tamaño small).
 *
 * Uso recomendado: `<StatusChip tone="success" label="Aplicado" />`.
 * `tone` es uno de STATUS_TONES (success/warning/error/info/default).
 * Si no se pasa `tone`, se deduce del `label` con LABEL_TONES (default: neutral).
 *
 * Compat: también acepta la prop legada `status` (equivale a `label`).
 */
const StatusChip = ({ tone, label, status, ...props }) => {
  const text = label ?? status;
  const resolvedTone = tone ?? LABEL_TONES[text] ?? STATUS_TONES.NEUTRAL;

  return <Chip size="small" variant="filled" color={resolvedTone} label={text} {...props} />;
};

export default StatusChip;
