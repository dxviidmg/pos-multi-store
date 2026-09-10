import { useEffect, useRef, useState } from "react";
import { Snackbar, Alert, AlertTitle, Box } from "@mui/material";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import WifiIcon from "@mui/icons-material/Wifi";
import { useOnlineStatus } from "@/src/shared/hooks/useOnlineStatus";

const RESTORED_DURATION_MS = 3000;

// Estilo compartido para que ambos avisos tengan el mismo tamaño (ancho y alto).
const alertSx = {
  width: "100%",
  maxWidth: { xs: "100%", sm: 480 },
  minHeight: 64,
  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
  borderRadius: "10px",
  alignItems: "center",
};

const snackbarSx = { top: { xs: 8, sm: 16 }, px: { xs: 1, sm: 0 } };

/**
 * Aviso global del estado de conexión a Internet.
 *
 * - Offline: banner fijo (arriba, centrado) de advertencia/error que permanece
 *   visible mientras no haya conexión. No bloquea la interfaz.
 * - Reconexión: aviso de éxito "Conexión restaurada" durante ~3s y luego se oculta.
 *
 * No modifica ni deshabilita botones ni bloquea la navegación.
 */
const ConnectionStatusBanner = () => {
  const online = useOnlineStatus();
  const [showRestored, setShowRestored] = useState(false);
  // Estado previo para detectar la transición offline -> online (evita mostrar
  // "Conexión restaurada" en la carga inicial cuando siempre estuvo online).
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    if (!online) {
      wasOfflineRef.current = true;
      setShowRestored(false);
    } else if (wasOfflineRef.current) {
      wasOfflineRef.current = false;
      setShowRestored(true);
    }
  }, [online]);

  return (
    <>
      {/* Banner persistente sin conexión */}
      <Snackbar
        open={!online}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={snackbarSx}
      >
        <Alert
          severity="error"
          variant="filled"
          icon={<WifiOffIcon />}
          sx={alertSx}
        >
          <AlertTitle sx={{ fontWeight: 700, mb: 0.25 }}>
            Sin conexión a Internet
          </AlertTitle>
          <Box component="span" sx={{ fontSize: "0.8rem" }}>
            Algunas funciones pueden no estar disponibles.
          </Box>
        </Alert>
      </Snackbar>

      {/* Aviso temporal de conexión restaurada */}
      <Snackbar
        open={showRestored}
        autoHideDuration={RESTORED_DURATION_MS}
        onClose={() => setShowRestored(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={snackbarSx}
      >
        <Alert
          severity="success"
          variant="filled"
          icon={<WifiIcon />}
          onClose={() => setShowRestored(false)}
          sx={{ ...alertSx, fontWeight: 600 }}
        >
          <AlertTitle sx={{ fontWeight: 700, mb: 0.25 }}>
            Conexión restaurada
          </AlertTitle>
          <Box component="span" sx={{ fontSize: "0.8rem" }}>
            Ya puedes usar todas las funciones.
          </Box>
        </Alert>
      </Snackbar>
    </>
  );
};

export default ConnectionStatusBanner;
