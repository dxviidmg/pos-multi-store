import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { getTaskResult } from "../apis/products";

const POLL_INTERVAL = 3000; // ms

const AuditDashboardData = ({ title, taskId }) => {
  const [data, setData] = useState([]);
  const [info, setInfo] = useState({ total: "por definir", progress: 0 });

  useEffect(() => {
    if (!taskId) return;

    const interval = setInterval(async () => {
      try {
        const { data: taskData } = await getTaskResult(taskId);
        const { result, info: taskInfo } = taskData;

        if (result !== null) {
          setData(result);
          clearInterval(interval);

          setInfo(prev => ({
            ...prev,
            total: result.length === 0 ? 0 : prev.total,
            progress: 100,
          }));
        } else {
          setInfo({
            total: taskInfo.total,
            progress: taskInfo.percent,
          });
        }
      } catch (error) {
        console.error("Error fetching task result:", error);
        clearInterval(interval);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [taskId]);

  const isComplete = info.progress === 100;

  return (
    <div className={`text-center custom-section2 ${
      info.progress === 100 ? "bg-success bg-opacity-75" : data.length > 0 ? "bg-danger bg-opacity-75" : "bg-primary bg-opacity-75"
    }`}>
      <h2 className="pt-3 pb-0 m-0">{title}</h2>
      <span className="fs-1">{data.length}</span>
      <span> de {info.total}</span>

      <ProgressBar
        animated={!isComplete}
        now={info.progress}
        label={`${info.progress}%`}
        variant={isComplete ? "success" : undefined}
      />
    </div>
  );
};

export default AuditDashboardData;
