import React, { useState } from "react";
import CustomButton from "../commons/customButton/CustomButton";
import { getRedeployRender } from "../apis/restart";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";
import { formatTimeFromDate } from "../utils/utils";

function RestartService() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const handleRedeploy = async () => {
    setIsLoading(true);
    const response = await getRedeployRender();
    setIsLoading(false);

    console.log(response);

    if (response.status === 200) {
      setData(response.data);
    } else {
      setData(response.response.data);
    }
  };
  return (
    <div className="custom-section">
      <CustomSpinner2 isLoading={isLoading} />
      <CustomButton onClick={() => handleRedeploy()}>
        Reiniciar servicio
      </CustomButton>

      {data?.deploy && (
        <p>
          Inicio de {formatTimeFromDate(data.deploy.createdAt)}, pasando 3
          minutos de esa hora, ya esta listo
        </p>
      )}

      {data?.error && <p>{data?.error}</p>}
    </div>
  );
}

export default RestartService;
