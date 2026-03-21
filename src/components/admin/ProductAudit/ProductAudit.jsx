import React, { useState } from "react";
import AuditCard from "../../ui/AuditCard/AuditCard";
import CustomButton from "../../ui/Button/Button";
import { getProductAudit, getProductAuditActivity } from "../../../api/audit";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { Grid } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";

const ProductAudit = () => {
  const [syncData, setSyncData] = useState(null);
  const [activityTaskId, setActivityTaskId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runCatalogAudit = async () => {
    setIsLoading(true);
    const { data } = await getProductAudit();
    setSyncData(data);
    setIsLoading(false);
  };

  const runActivityAudit = async () => {
    setIsLoading(true);
    const { data } = await getProductAuditActivity();
    setActivityTaskId(data.task);
    setIsLoading(false);
  };

  return (
    <div>
      <CustomSpinner isLoading={isLoading} />
      <Grid className="card">
        <h1>Auditoría de productos</h1>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomButton fullWidth onClick={runCatalogAudit} startIcon={<AssessmentIcon />}>
              Auditar catálogo
            </CustomButton>
          </Grid>
          <Grid item xs={12} lg={3}>
            <AuditCard title="Códigos repetidos" syncResult={syncData?.duplicate_codes} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <AuditCard title="Costo en cero" syncResult={syncData?.zero_cost} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <AuditCard title="Precio mayoreo inconsistente" syncResult={syncData?.wholesale_issues} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <AuditCard title="Faltantes en tiendas" syncResult={syncData?.missing_in_stores} />
          </Grid>

          <Grid item xs={12}>
            <CustomButton fullWidth onClick={runActivityAudit} startIcon={<AssessmentIcon />}>
              Auditar actividad
            </CustomButton>
            <div style={{ marginTop: 16 }}>
              <AuditCard title="Productos sin movimiento" taskId={activityTaskId} />
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductAudit;
