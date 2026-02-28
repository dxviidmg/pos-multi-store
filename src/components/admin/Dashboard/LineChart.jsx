import React, { useEffect, useState } from "react";
import { getTaskResult } from "../../../api/products";
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';
import { Box, Typography } from '@mui/material';

const LineChart = ({ title, taskId, labels, xText, yText, pollInterval = 5000 }) => {
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        const { data: taskData } = await getTaskResult(taskId);
        const { result, status } = taskData;

        if (status === "SUCCESS") {
          setDatasets(result || []);
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

  const series = datasets.map((dataset) => ({
    data: dataset.data || [],
    label: dataset.label || '',
    color: dataset.borderColor || undefined,
  }));

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        {title}
      </Typography>
      <MuiLineChart
        xAxis={[{ 
          data: labels || [],
          scaleType: 'point',
          label: xText,
        }]}
        series={series}
        height={350}
        margin={{ top: 10, bottom: 50, left: 70, right: 10 }}
      />
    </Box>
  );
};

export default LineChart;
