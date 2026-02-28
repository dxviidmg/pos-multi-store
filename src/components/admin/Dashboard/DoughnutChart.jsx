import React, { useEffect, useState } from "react";
import { getTaskResult } from "../../../api/products";
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography } from '@mui/material';

const DoughnutChart = ({
  title,
  taskId,
  pollInterval = 5000,
}) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        const { data: taskData } = await getTaskResult(taskId);
        const { result, status } = taskData;

        if (status === "SUCCESS") {
          const data = Object.entries(result).map(([label, value], index) => ({
            id: index,
            value: value,
            label: label,
          }));
          setChartData(data);
          clearInterval(intervalId);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error("Error fetching task result:", error);
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

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        {title}
      </Typography>
      <PieChart
        series={[
          {
            data: chartData,
            innerRadius: 60,
            outerRadius: 120,
            paddingAngle: 2,
            cornerRadius: 5,
          },
        ]}
        height={350}
        margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
      />
    </Box>
  );
};

export default DoughnutChart;
