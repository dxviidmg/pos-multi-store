import React, { useEffect, useState } from "react";
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography } from '@mui/material';

const processData = (result, dataType) => {
  if (!result || !result.sales || result.sales.length === 0) return [];

  const { sales } = result;

  switch (dataType) {
    case 'payment': {
      const grouped = {};
      sales.forEach(item => {
        const key = item.payment_method || 'Sin método';
        grouped[key] = (grouped[key] || 0) + (item.count || 0);
      });
      return Object.entries(grouped).map(([label, value], index) => ({
        id: index,
        value: value,
        label: label,
      }));
    }
    
    case 'store': {
      const grouped = {};
      sales.forEach(item => {
        const key = item.store_name || 'Sin tienda';
        grouped[key] = (grouped[key] || 0) + (item.count || 0);
      });
      return Object.entries(grouped).map(([label, value], index) => ({
        id: index,
        value: value,
        label: label,
      }));
    }
    
    default:
      return [];
  }
};

const DoughnutChart = ({ title, data, dataType }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!data) return;
    const processedData = processData(data, dataType);
    setChartData(processedData);
  }, [data, dataType]);

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
