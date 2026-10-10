import React, { useCallback, useEffect, useState } from "react";
import CustomButton from "../../ui/Button/Button";
import { getRedeployRender } from "../../../api/restart";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { formatTimeFromDate } from "../../../utils/date";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { readString, removeKey, writeString } from "../../../utils/storage";
import { Grid, Typography, Alert, Box, Divider } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SyncIcon from "@mui/icons-material/Sync";

const DEPLOY_MINUTES = 3;

function RestartService() {
  const [isLoading, setIsLoading] = useState(false);
  const [finishAt, setFinishAt] = useState(null);
  const [error, setError] = useState(null);

  const isDisabled = finishAt && new Date(finishAt).getTime() > Date.now();

  const scheduleEnable = useCallback((finishTime) => {
    const delay = new Date(finishTime).getTime() - Date.now();
    if (delay <= 0) return;
    const timeout = setTimeout(() => {
      setFinishAt(null);
      removeKey(STORAGE_KEYS.DEPLOY_FINISH_AT);
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const stored = readString(STORAGE_KEYS.DEPLOY_FINISH_AT);
    if (stored && new Date(stored).getTime() > Date.now()) {
      setFinishAt(stored);
      return scheduleEnable(stored);
    }
  }, [scheduleEnable]);

  const handleRedeploy = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getRedeployRender();
      const finish = new Date(data.deploy.createdAt);
      finish.setMinutes(finish.getMinutes() + DEPLOY_MINUTES);
      const finishIso = finish.toISOString();
      writeString(STORAGE_KEYS.DEPLOY_FINISH_AT, finishIso);
      setFinishAt(finishIso);
      scheduleEnable(finishIso);
    } catch (err) {
      // Con respuesta del servidor se muestra su motivo; sin respuesta, es un problema de conexión
      setError(err.response ? err.response.data?.error || "Error al sincronizar" : "Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid className="card">
      <CustomSpinner isLoading={isLoading} />

      <Box sx={{ textAlign: "center", mb: 3 }}>
        <SyncIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
        <Typography variant="h5" fontWeight={700}>Sincronizar servicio</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Si el sistema está lento, sincroniza para mejorar la velocidad. El proceso tarda aproximadamente {DEPLOY_MINUTES} minutos.
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <CustomButton onClick={handleRedeploy} disabled={!!isDisabled || isLoading} startIcon={<RestartAltIcon />}>
          {isLoading ? "Sincronizando..." : "Sincronizar ahora"}
        </CustomButton>
      </Box>

      {isDisabled && (
        <Alert severity="warning" variant="outlined">
          El servicio se está sincronizando. Disponible a las: <b>{formatTimeFromDate(finishAt)}</b>
        </Alert>
      )}

      {error && (
        <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>{error}</Alert>
      )}
    </Grid>
  );
}

export default RestartService;
