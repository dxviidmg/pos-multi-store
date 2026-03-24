import React, { useEffect, useState } from "react";
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography } from '@mui/material';
import { CHART_COLORS } from '../../../utils/utils';

const processData = (result, dataType, metricType) => {
  if (!result || !result.sales || result.sales.length === 0) return [];

  const { sales } = result;

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
        color: CHART_COLORS[index % CHART_COLORS.length],
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
        color: CHART_COLORS[index % CHART_COLORS.length],
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
    const total = processedData.reduce((sum, d) => sum + d.value, 0);
    setChartData(processedData.map(d => ({
      ...d,
      label: `${d.label} (${total ? ((d.value / total) * 100).toFixed(1) : 0}%)`,
    })));
  }, [data, dataType, metricType]);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: '#1e293b' }}>
        {title}
      </Typography>
      <PieChart
        series={[
          {
            data: chartData,
            innerRadius: 65,
            outerRadius: 105,
            paddingAngle: 1,
            cornerRadius: 4,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 60, additionalRadius: -5, color: 'gray' },
          },
        ]}
        height={300}
        margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
        slotProps={{
          legend: {
            direction: 'column',
            position: { vertical: 'middle', horizontal: 'right' },
            padding: 0,
            itemMarkWidth: 12,
            itemMarkHeight: 12,
            markGap: 8,
            itemGap: 10,
            labelStyle: {
              fontSize: 13,
              fill: '#475569',
            },
          },
        }}
        sx={{
          '& .MuiPieArc-root': {
            stroke: '#fff',
            strokeWidth: 2,
          },
        }}
      />
    </Box>
  );
};

export default DoughnutChart;
