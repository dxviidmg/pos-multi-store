import React, { useEffect, useState } from "react";
import { getTaskResult } from "../apis/products";
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

const LineChart = ({ title, taskId, labels, xText, yText, pollInterval = 5000 }) => {
  const [datasets, setDatasets] = useState([]);

  const data = {
    labels: labels,
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
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yText,
        },
      },
      x: {
        title: {
          display: true,
          text: xText,
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
        const { result, status } = taskData;

        if (status === "SUCCESS") {
          setDatasets(result || []);
          clearInterval(intervalId);
          return true; // tarea completada
        } else {
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

  return (
    <div>

<Line data={data} options={options} />

    </div>
  );
};

export default LineChart;
