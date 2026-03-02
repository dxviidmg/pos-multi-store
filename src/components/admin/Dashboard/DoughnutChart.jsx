import React, { useEffect, useState } from "react";
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography } from '@mui/material';

const processData = (result, dataType, metricType) => {
  if (!result || !result.sales || result.sales.length === 0) return [];

  const { sales } = result;
  const colors = ['#1976d2', '#dc004e', '#ff9800', '#4caf50', '#9c27b0'];

  switch (dataType) {
    case 'payment': {
      const grouped = {};
      sales.forEach(item => {
        const key = item.payment_method || 'Sin método';
        grouped[key] = (grouped[key] || 0) + (metricType === 'total' ? (item.total || 0) : 1);
      });
      return Object.entries(grouped).map(([label, value], index) => ({
        id: index,
        value: value,
        label: label,
        color: colors[index % colors.length],
      }));
    }
    
    case 'store': {
      const grouped = {};
      sales.forEach(item => {
        const key = item.store_name || 'Sin tienda';
        grouped[key] = (grouped[key] || 0) + (metricType === 'total' ? (item.total || 0) : 1);
      });
      return Object.entries(grouped).map(([label, value], index) => ({
        id: index,
        value: value,
        label: label,
        color: colors[index % colors.length],
      }));
    }
    
    default:
      return [];
  }
};

const DoughnutChart = ({ title, data, dataType, metricType = 'count' }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!data) return;
    const processedData = processData(data, dataType, metricType);
    setChartData(processedData);
  }, [data, dataType, metricType]);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'var(--color-primary)' }}>
        {title}
      </Typography>
      <PieChart
        series={[
          {
            data: chartData,
            innerRadius: 60,
            outerRadius: 100,
            paddingAngle: 2,
            cornerRadius: 5,
            arcLabel: 'value',
            arcLabelMinAngle: 35,
          },
        ]}
        height={300}
        margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
        slotProps={{
          legend: {
            direction: 'column',
            position: { vertical: 'middle', horizontal: 'right' },
            padding: 0,
          },
        }}
      />
    </Box>
  );
};

export default DoughnutChart;
