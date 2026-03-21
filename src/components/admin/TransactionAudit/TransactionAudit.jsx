import React, { useEffect, useState } from "react";

import { getFormattedDate } from "../../../utils/utils";
import TransactionAuditData from "./TransactionAuditData";
import CustomButton from "../../ui/Button/Button";
import { getAudit, getAudit2 } from "../../../api/audit";
import { getStores } from "../../../api/stores";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";

const TransactionAudit = () => {
  const today = getFormattedDate();
  const [tasks, setTasks] = useState({});
  const [params, setParams] = useState({
    end_date: today,
    start_date: today,
  });
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getStores();
      setStores(response.data);
    };

    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true)
    const response = await getAudit(params);

    setTasks((prev) => ({ ...prev, ...response.data }));
    setIsLoading(false)
  };

  const fetchData2 = async () => {
    setIsLoading(true)
    const response = await getAudit2(params);

    setTasks((prev) => ({ ...prev, ...response.data }));
    setIsLoading(false)
  };

  const handleParams = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    fetchData();
  };

  const handleSubmit2 = () => {
    fetchData2();
  };
  return (
    <div>
      <CustomSpinner isLoading={isLoading}></CustomSpinner>
      <Grid className="card">
        <h1>Auditoría de transacciones</h1>
        <Grid container spacing={2}>
          {" "}
          <Grid item xs={12} md={6} lg={4}>
            {" "}
            <FormControl fullWidth size="small">
              <InputLabel>Tienda o Almacen</InputLabel>
              <Select fullWidth size="small" value={params.store_id}
              onChange={(e) => handleParams(e)}
              name="store_id"
              label="Tienda o Almacen"
            >
              <MenuItem value="">Seleccionar</MenuItem>
              {stores.map((store) => (
                <MenuItem key={store.id} value={store.id}>
                  {store.full_name}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            {" "}
            <Box component="form">
              <TextField size="small" fullWidth label="Fecha de inicio" name="start_date"
                type="date"
                value={params.start_date}
                onChange={(e) => handleParams(e)}
                max={today}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            {" "}
            <Box component="form">
              <TextField size="small" fullWidth label="Fecha de fin" name="end_date"
                type="date"
                value={params.end_date}
                onChange={(e) => handleParams(e)}
                max={today}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={3} lg={6}>
            <CustomButton fullWidth onClick={() => handleSubmit()} startIcon={<AssessmentIcon />}>
              Analizar ventas y logs
            </CustomButton>
          </Grid>
          <Grid item xs={12} md={3} lg={6}>
            <CustomButton fullWidth onClick={() => handleSubmit2()} startIcon={<AssessmentIcon />}>
              Analizar stock
            </CustomButton>
          </Grid>
          <Grid item xs={12} lg={4}>
            <TransactionAuditData
              title={"Ventas repetidas"}
              taskId={tasks?.task1}
            ></TransactionAuditData>
          </Grid>
          <Grid item xs={12} lg={4}>
            {" "}
            <TransactionAuditData
              title={"Logs repetidos o inconsistentes"}
              taskId={tasks?.task2}
            ></TransactionAuditData>
          </Grid>
          <Grid item xs={12} lg={4}>
            {" "}
            <TransactionAuditData
              title={"Stock y ultimo log"}
              taskId={tasks?.task3}
            ></TransactionAuditData>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default TransactionAudit;
