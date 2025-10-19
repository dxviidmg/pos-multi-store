import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { getTaskResult } from "../apis/products";

const AuditDashboardData = ({ title, taskId }) => {
  const [data, setData] = useState([]);
  const [info, setInfo] = useState({total: "por definir", progress:0});
  useEffect(() => {
    if (!taskId) return;
    const interval = setInterval(async () => {
      const response = await getTaskResult(taskId);
      console.log(response.data);
      if (response.data.result !== null) {
        setData(response.data.result);
        clearInterval(interval);
        if (response.data.result.length === 0){
          setInfo({total: 0, progress:100})
        }
        else{
          setInfo(prev=>({...prev, progress:100}))
        }

      } else {
        setInfo({total: response.data.info.total, progress:response.data.info.percent})
      }
    }, 3000); // cada 2 segundos

    return () => clearInterval(interval);
  }, [taskId]);

  return (
    <div className="text-center">
      <h2 className="pt-3 pb-0 m-0">{title}</h2>
      <span className="fs-1">{data.length}</span>
      <span className="">de {info.total}</span>

      <ProgressBar animated={info.progress !== 100} now={info.progress} label={`${info.progress}%`} variant={info.progress === 100 ? 'success' : ''}/>
    </div>
  );
};

export default AuditDashboardData;
