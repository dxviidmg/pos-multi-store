import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { getFormattedDate } from "../utils/utils";
import AuditDashboardData from "./AuditDashboardData";
import CustomButton from "../commons/customButton/CustomButton";
import { getAudit, getAudit2 } from "../apis/audit";
import { getStores } from "../apis/stores";
import { CustomSpinner } from "../commons/customSpinner/CustomSpinner";
import { Grid } from "@mui/material";

const AuditDashboard = () => {
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
      <Grid className="custom-section">
        <h1>Tablero de auditoria</h1>
        <Grid container>
          {" "}
          <Grid item xs={12} md={6} lg={2}>
            {" "}
            <Form.Label>Tienda o Almacen</Form.Label>
            <Form.Select
              value={params.store_id}
              onChange={(e) => handleParams(e)}
              name="store_id"
              //              disabled={isLoading}
            >
              <option value="">Seleccionar</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.full_name}
                </option>
              ))}
            </Form.Select>
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            {" "}
            <Form>
              <Form.Label>Fecha de inicio</Form.Label>
              <Form.Control
                name="start_date"
                type="date"
                value={params.start_date}
                onChange={(e) => handleParams(e)}
                max={today}
              />
            </Form>
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            {" "}
            <Form>
              <Form.Label>Fecha de fin</Form.Label>
              <Form.Control
                name="end_date"
                type="date"
                value={params.end_date}
                onChange={(e) => handleParams(e)}
                max={today}
              />
            </Form>
          </Grid>
          <Grid item xs={12} md={3} lg={3} className="d-flex flex-column justify-content-end">
            <CustomButton fullWidth onClick={() => handleSubmit()}>
              Analizar ventas y logs
            </CustomButton>
          </Grid>
          <Grid item xs={12} md={3} lg={3} className="d-flex flex-column justify-content-end">
            <CustomButton fullWidth onClick={() => handleSubmit2()}>
              Analizar stock
            </CustomButton>
          </Grid>
          <Grid item xs={12} lg={4}>
            <AuditDashboardData
              title={"Ventas repetidas"}
              taskId={tasks?.task1}
            ></AuditDashboardData>
          </Grid>
          <Grid item xs={12} lg={4}>
            {" "}
            <AuditDashboardData
              title={"Logs repetidos o inconsistentes"}
              taskId={tasks?.task2}
            ></AuditDashboardData>
          </Grid>
          <Grid item xs={12} lg={4}>
            {" "}
            <AuditDashboardData
              title={"Stock y ultimo log"}
              taskId={tasks?.task3}
            ></AuditDashboardData>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default AuditDashboard;
