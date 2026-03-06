import React, { useEffect, useState } from "react";
import { LinearProgress, Box, Typography } from "@mui/material";
import { getTaskResult } from "../../../api/products";
import CustomButton from "../../ui/Button/Button";
import { exportToExcel } from "../../../utils/utils";
import DownloadIcon from "@mui/icons-material/Download";

const AuditDashboardData = ({ title, taskId, pollInterval = 7500 }) => {
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
          setInfo({ total: taskInfo.total, progress: taskInfo.percent });
          return false; // tarea no completada
        }
      } catch (error) {
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

  const getBackgroundColor = () => {
    if (info.progress !== 100) return 'rgba(25, 118, 210, 0.75)'; // primary
    if (data.length === 0) return 'rgba(46, 125, 50, 0.75)'; // success
    return 'rgba(211, 47, 47, 0.75)'; // danger
  };

  return (
    <div
      className="text-center custom-section"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <h2 className="pt-3 pb-0 m-0">{title}</h2>
      <span className="fs-1">{data.length}</span>
      <span> de {info.total}</span>

      <Box sx={{ width: '100%', my: 2 }}>
        <LinearProgress 
          variant="determinate" 
          value={info.progress}
          color={isComplete ? "success" : "primary"}
        />
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
          {info.progress}%
        </Typography>
      </Box>

      <CustomButton
        fullWidth
        disabled={!data || data.length === 0}
        onClick={handleDownload}
        startIcon={<DownloadIcon />}
      >
        Descargar
      </CustomButton>
    </div>
  );
};

export default AuditDashboardData;
