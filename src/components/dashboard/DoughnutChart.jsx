import React, { useEffect, useState } from "react";
import { getTaskResult } from "../apis/products";

import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({
  title,
  taskId,
  pollInterval = 5000,
}) => {
  const [labels, setLabels] = useState([]);
  const [d, setD] = useState([]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: d,
        backgroundColor: [
          "blue",
          "red",
          "green",
          "yellow"
        ],
        hoverOffset: 4,
      },
    ],
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
  };

  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        //      setData([]);
        const { data: taskData } = await getTaskResult(taskId);
        const { result, status } = taskData;

        if (status === "SUCCESS") {
          console.log(data);
          const labels2 = Object.keys(result).map((code) => code);
          const values = Object.values(result);
          setLabels(labels2);
          setD(values);
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
  }, [taskId, pollInterval]);

  return (
    <div>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
