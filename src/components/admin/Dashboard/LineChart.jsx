import React, { useEffect, useState } from "react";
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';
import { Box, Typography } from '@mui/material';

const processData = (result, dataType, metricType, labels) => {
  if (!result || !result.sales || result.sales.length === 0) return [];

  const { stores, sales } = result;
  const colors = ['#1976d2', '#dc004e', '#ff9800', '#4caf50', '#9c27b0'];

  switch (dataType) {
    case 'monthly': {
      const storeData = {};
      
      stores.forEach(store => {
        storeData[store.name] = Array(12).fill(0);
      });
      
      sales.forEach(item => {
        const date = new Date(item.created_at);
        const month = date.getMonth();
        const storeName = item.store_name;
        if (storeData[storeName]) {
          storeData[storeName][month] += metricType === 'total' ? (item.total || 0) : 1;
        }
      });
      
      return Object.entries(storeData).map(([storeName, monthlyData], index) => ({
        data: monthlyData,
        label: storeName,
        color: colors[index % colors.length],
      }));
    }
    
    case 'daily': {
      const storeData = {};
      
      stores.forEach(store => {
        storeData[store.name] = Array(7).fill(0);
      });
      
      sales.forEach(item => {
        const date = new Date(item.created_at);
        const day = date.getDay();
        const storeName = item.store_name;
        if (storeData[storeName]) {
          storeData[storeName][day] += metricType === 'total' ? (item.total || 0) : 1;
        }
      });
      
      return Object.entries(storeData).map(([storeName, dailyData], index) => ({
        data: dailyData,
        label: storeName,
        color: colors[index % colors.length],
      }));
    }
    
    case 'hourly': {
      const storeData = {};
      
      stores.forEach(store => {
        storeData[store.name] = Array(24).fill(0);
      });
      
      sales.forEach(item => {
        const date = new Date(item.created_at);
        const hour = date.getHours();
        const storeName = item.store_name;
        if (storeData[storeName]) {
          storeData[storeName][hour] += metricType === 'total' ? (item.total || 0) : 1;
        }
      });
      
      return Object.entries(storeData).map(([storeName, hourlyData], index) => ({
        data: hourlyData,
        label: storeName,
        color: colors[index % colors.length],
      }));
    }
    
    default:
      return [];
  }
};

const LineChart = ({ title, data, labels, xText, yText, dataType, metricType = 'count' }) => {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    if (!data) return;
    const processedData = processData(data, dataType, metricType, labels);
    setSeries(processedData);
  }, [data, dataType, metricType, labels]);

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
        yAxis={[{ 
          min: 0,
        }]}
        series={series}
        height={350}
        margin={{ top: 10, bottom: 50, left: 70, right: 10 }}
      />
    </Box>
  );
};

export default LineChart;
