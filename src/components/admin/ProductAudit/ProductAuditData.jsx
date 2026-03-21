import React, { useEffect, useState } from "react";
import {
  LinearProgress,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import { getTaskResult } from "../../../api/products";
import CustomButton from "../../ui/Button/Button";
import { exportToExcel } from "../../../utils/utils";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

const statusConfig = {
  idle: { color: "default", icon: <HourglassTopIcon />, label: "En espera" },
  pending: { color: "info", icon: <HourglassTopIcon />, label: "Procesando" },
  success: { color: "success", icon: <CheckCircleIcon />, label: "Sin problemas" },
  danger: { color: "error", icon: <ErrorIcon />, label: "Requiere atención" },
};

const ProductAuditData = ({ title, taskId, syncResult, pollInterval = 7500 }) => {
  const [data, setData] = useState([]);
  const [info, setInfo] = useState({ total: "por definir", progress: 0 });
  const isSync = syncResult !== undefined;

  // Sync mode: data comes directly from props
  useEffect(() => {
    if (syncResult === undefined || syncResult === null) return;
    setData(syncResult);
    setInfo({ total: syncResult.length, progress: 100 });
  }, [syncResult]);

  // Async mode: poll task
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
          return true;
        } else {
          setInfo({ total: taskInfo.total, progress: taskInfo.percent });
          return false;
        }
      } catch (error) {
        clearInterval(intervalId);
        return true;
      }
    };

    let intervalId;
    fetchTask().then((finished) => {
      if (!finished) {
        intervalId = setInterval(fetchTask, pollInterval);
      }
    });

    return () => clearInterval(intervalId);
  }, [taskId, pollInterval]);

  const isComplete = info.progress === 100;
  const hasSource = isSync ? syncResult !== undefined && syncResult !== null : !!taskId;
  const status = !hasSource ? "idle" : !isComplete ? "pending" : data.length === 0 ? "success" : "danger";
  const { color, icon, label } = statusConfig[status];

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        bgcolor: "background.default",
        boxShadow: "none",
        "&:hover": { boxShadow: "none", transform: "none" },
      }}
    >
      <CardContent sx={{ textAlign: "center", pb: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {title}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h3" fontWeight={700} color={`${color}.main`}>
          {data.length}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {isComplete ? `de ${info.total} registros` : `de ${info.total} registros`}
        </Typography>

        <Chip icon={icon} label={label} color={color} size="small" variant="outlined" sx={{ mb: 2 }} />

        {!isSync && (
          <Box sx={{ width: "100%", mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={info.progress}
              color={isComplete ? "success" : "primary"}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              {info.progress}%
            </Typography>
          </Box>
        )}

        <CustomButton
          fullWidth
          disabled={!data || data.length === 0}
          onClick={() => exportToExcel(data, title, false)}
          startIcon={<DownloadIcon />}
        >
          Descargar
        </CustomButton>
      </CardContent>
    </Card>
  );
};

export default ProductAuditData;
