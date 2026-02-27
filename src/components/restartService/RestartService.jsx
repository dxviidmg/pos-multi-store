import React, { useEffect, useState } from "react";
import CustomButton from "../commons/customButton/CustomButton";
import { getRedeployRender } from "../apis/restart";
import { CustomSpinner } from "../commons/customSpinner/CustomSpinner";
import { formatTimeFromDate } from "../utils/utils";
import { Grid } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

function RestartService() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);

  // 🔹 Verificar localStorage al cargar
  useEffect(() => {
    const finishAt = localStorage.getItem("deploy_finish_at");

    if (finishAt) {
      const now = Date.now();
      const finishTime = new Date(finishAt).getTime();

      if (now < finishTime) {
        setIsDisabled(true);

        // ⏱️ re-habilitar automáticamente cuando pase el tiempo
        const timeout = setTimeout(() => {
          setIsDisabled(false);
          localStorage.removeItem("deploy_finish_at");
        }, finishTime - now);

        return () => clearTimeout(timeout);
      }
    }
  }, []);

  const handleRedeploy = async () => {
    setIsLoading(true);
    const response = await getRedeployRender();
    setIsLoading(false);

    if (response.status === 200) {
      const createdAt = new Date(response.data.deploy.createdAt);
      createdAt.setMinutes(createdAt.getMinutes() + 3);

      const finishAt = createdAt.toISOString();

      // 💾 guardar en localStorage
      localStorage.setItem("deploy_finish_at", finishAt);

      setIsDisabled(true);

      setData(response.data);

      // ⏱️ re-habilitar botón después de 5 min
      const delay = new Date(finishAt).getTime() - Date.now();
      setTimeout(() => {
        setIsDisabled(false);
        localStorage.removeItem("deploy_finish_at");
      }, delay);

    } else {
      setData(response.response?.data);
    }
  };

  return (
    <Grid className="custom-section">
      <CustomSpinner isLoading={isLoading} />

      <CustomButton
        onClick={handleRedeploy}
        disabled={isDisabled || isLoading}
        startIcon={<RestartAltIcon />}
      >
        Sincronizar servicio
      </CustomButton>

      {data?.deploy && (
        <p>
          Inicio: {formatTimeFromDate(data.deploy.createdAt)} <br />
          Disponible nuevamente a las:{" "}
          {formatTimeFromDate(data.finishAt)}
        </p>
      )}

      {isDisabled && (
        <p style={{ color: "orange" }}>
          El servicio se está reiniciando, intenta más tarde.
        </p>
      )}

      {data?.error && <p>{data.error}</p>}
    </Grid>
  );
}

export default RestartService;
