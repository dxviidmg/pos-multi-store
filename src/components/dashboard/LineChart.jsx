import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { getTaskResult } from "../apis/products";
import CustomButton from "../commons/customButton/CustomButton";
import { exportToExcel } from "../utils/utils";



import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ title, taskId, pollInterval = 5000 }) => {
  const [datasets, setDatasets] = useState([]);
  const [info, setInfo] = useState({ total: "por definir", progress: 0 });



  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Juli", "a", "S", "O", "N", "D"],
    datasets: datasets,
  };


  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Sales Comparison 2024 vs 2025",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Sales Amount ($)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
    },
  };

  
  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
  //      setData([]);
        const { data: taskData } = await getTaskResult(taskId);
        const { result, info: taskInfo, status } = taskData;

        if (status === "SUCCESS") {
          setDatasets(result || []);
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
  }, [taskId]);

  const isComplete = info.progress === 100;

  const handleDownload = () => {
    exportToExcel(data, title, false);
  };

  return (
    <div>

<Line data={data} options={options} />

    </div>
  );
};

export default LineChart;
