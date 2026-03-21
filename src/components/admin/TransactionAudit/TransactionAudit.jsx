import React, { useEffect, useState } from "react";
import { getFormattedDate } from "../../../utils/utils";
import TransactionAuditData from "./TransactionAuditData";
import CustomButton from "../../ui/Button/Button";
import { getAudit, getAudit2 } from "../../../api/audit";
import { getStores } from "../../../api/stores";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";

const TransactionAudit = () => {
  const today = getFormattedDate();
  const [tasks, setTasks] = useState({});
  const [params, setParams] = useState({ end_date: today, start_date: today });
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getStores().then((res) => setStores(res.data));
  }, []);

  const handleParams = (e) => {
    setParams((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const runAudit = async (apiFn) => {
    setIsLoading(true);
    const { data } = await apiFn(params);
    setTasks((prev) => ({ ...prev, ...data }));
    setIsLoading(false);
  };

  return (
    <div>
      <CustomSpinner isLoading={isLoading} />
      <Grid className="card">
        <h1>Auditoría de transacciones</h1>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Tienda o almacén</InputLabel>
              <Select
                size="small"
                value={params.store_id || ""}
                onChange={handleParams}
                name="store_id"
                label="Tienda o almacén"
              >
                <MenuItem value="">Todas</MenuItem>
                {stores.map((s) => (
                  <MenuItem key={s.id} value={s.id}>{s.full_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              size="small" fullWidth label="Fecha de inicio" name="start_date"
              type="date" value={params.start_date} onChange={handleParams}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              size="small" fullWidth label="Fecha de fin" name="end_date"
              type="date" value={params.end_date} onChange={handleParams}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomButton fullWidth onClick={() => runAudit(getAudit)} startIcon={<AssessmentIcon />}>
              Auditar ventas y logs
            </CustomButton>
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomButton fullWidth onClick={() => runAudit(getAudit2)} startIcon={<AssessmentIcon />}>
              Auditar stock
            </CustomButton>
          </Grid>
          <Grid item xs={12} lg={4}>
            <TransactionAuditData title="Ventas duplicadas" taskId={tasks?.task1} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <TransactionAuditData title="Logs inconsistentes" taskId={tasks?.task2} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <TransactionAuditData title="Discrepancias de stock" taskId={tasks?.task3} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default TransactionAudit;
