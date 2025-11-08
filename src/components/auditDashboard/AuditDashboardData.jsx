import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { getTaskResult } from "../apis/products";
import CustomButton from "../commons/customButton/CustomButton";
import { exportToExcel } from "../utils/utils";

const AuditDashboardData = ({ title, taskId, pollInterval = 5000 }) => {
  const [data, setData] = useState([]);
  const [info, setInfo] = useState({ total: "por definir", progress: 0 });

  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        setData([]);
        const { data: taskData } = await getTaskResult(taskId);
        const { result, info: taskInfo, status } = taskData;

        if (status === "SUCCESS") {
          setData(result || []);
          setInfo((prev) => ({ ...prev, total: prev.total, progress: 100 }));
          clearInterval(intervalId);
          return true; // tarea completada
        } else {
          console.log("aun sigo");
          setInfo({ total: taskInfo.total, progress: taskInfo.percent });
          return false; // tarea no completada
        }
      } catch (error) {
        console.error("Error fetching task result:", error);
        clearInterval(intervalId);
        return true; // parar en caso de error
      }
    };

    let intervalId;

    // Llamada inmediata
    fetchTask().then((finished) => {
      if (!finished) {
        // luego iniciar polling
        intervalId = setInterval(fetchTask, pollInterval);
      }
    });

    return () => clearInterval(intervalId);
  }, [taskId, pollInterval]);

  const isComplete = info.progress === 100;

  const handleDownload = () => {
    exportToExcel(data, title, false);
  };

  return (
    <div
      className={`text-center custom-section2 ${
        info.progress !== 100
          ? "bg-primary bg-opacity-75"
          : data.length === 0
          ? "bg-success bg-opacity-75"
          : "bg-danger bg-opacity-75"
      }`}
    >
      <h2 className="pt-3 pb-0 m-0">{title}</h2>
      <span className="fs-1">{data.length}</span>
      <span> de {info.total}</span>

      <ProgressBar
        animated={!isComplete}
        now={info.progress}
        label={`${info.progress}%`}
        variant={isComplete ? "success" : undefined}
      />
      <CustomButton
        fullWidth
        disabled={!data || data.length === 0}
        onClick={handleDownload}
      >
        Descargar
      </CustomButton>
    </div>
  );
};

export default AuditDashboardData;
