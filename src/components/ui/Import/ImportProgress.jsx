import { LinearProgress } from "@mui/material";

/** Barra de progreso de un flujo de importación: se muestra solo mientras `loading`. */
const ImportProgress = ({ loading }) =>
  loading ? <LinearProgress sx={{ mb: 2, borderRadius: 1 }} /> : null;

export default ImportProgress;
