import React, { useState } from "react";
import AuditCard from "../../ui/AuditCard/AuditCard";
import CustomButton from "../../ui/Button/Button";
import { getAudit, getStockAudit } from "../../../api/audit";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { Grid } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { getFormattedDate } from "../../../utils/date";
import { showRequestError } from "../../../utils/alerts";
import PageHeader from "../../ui/PageHeader";
import StoreSelect from "../../ui/StoreSelect/StoreSelect";
import DateRangeFilter from "../../ui/DateRangeFilter/DateRangeFilter";

const DATE_ITEM_PROPS = { xs: 12, md: 6, lg: 4 };

const TransactionAudit = () => {
  const [tasks, setTasks] = useState({});
  const [params, setParams] = useState(() => {
    const today = getFormattedDate();
    return { end_date: today, start_date: today };
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleParams = (e) => {
    setParams((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const runAudit = async (apiFn) => {
    setIsLoading(true);
    try {
      const { data } = await apiFn(params);
      setTasks((prev) => ({ ...prev, ...data }));
    } catch (error) {
      showRequestError("iniciar la auditoría", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <CustomSpinner isLoading={isLoading} />
      <Grid className="card">
        <PageHeader title="Auditoría de transacciones" />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <StoreSelect
              value={params.store_id || ""}
              onChange={handleParams}
              name="store_id"
              label="Sucursal"
              allLabel="Todas"
            />
          </Grid>
          <DateRangeFilter
            startDate={params.start_date}
            endDate={params.end_date}
            onChange={handleParams}
            max={null}
            shrinkLabels
            itemProps={DATE_ITEM_PROPS}
          />
          <Grid item xs={12} md={6}>
            <CustomButton fullWidth onClick={() => runAudit(getAudit)} startIcon={<AssessmentIcon />}>
              Auditar ventas y logs
            </CustomButton>
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomButton fullWidth onClick={() => runAudit(getStockAudit)} startIcon={<AssessmentIcon />}>
              Auditar stock
            </CustomButton>
          </Grid>
          <Grid item xs={12} lg={4}>
            <AuditCard title="Ventas duplicadas" taskId={tasks?.task1} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <AuditCard title="Logs inconsistentes" taskId={tasks?.task2} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <AuditCard title="Discrepancias de stock" taskId={tasks?.task3} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default TransactionAudit;
