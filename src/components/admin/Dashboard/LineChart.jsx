import React, { useEffect, useState } from "react";
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';
import { Box, Typography } from '@mui/material';

const processData = (result, dataType, labels) => {
  if (!result || !result.sales || result.sales.length === 0) return [];

  const { stores, sales } = result;

  switch (dataType) {
    case 'monthly': {
      const storeData = {};
      
      // Inicializar todas las tiendas con 0
      stores.forEach(store => {
        storeData[store.name] = Array(12).fill(0);
      });
      
      // Llenar con datos reales
      sales.forEach(item => {
        const storeName = item.store_name;
        const month = new Date(item.month).getMonth();
        if (storeData[storeName]) {
          storeData[storeName][month] = item.count || 0;
        }
      });
      
      return Object.entries(storeData).map(([storeName, monthlyData]) => ({
        data: monthlyData,
        label: storeName,
      }));
    }
    
    case 'daily': {
      const storeData = {};
      
      // Inicializar todas las tiendas con 0
      stores.forEach(store => {
        storeData[store.name] = Array(7).fill(0);
      });
      
      // Llenar con datos reales
      sales.forEach(item => {
        const storeName = item.store_name;
        const day = new Date(item.day).getDay();
        if (storeData[storeName]) {
          storeData[storeName][day] = item.count || 0;
        }
      });
      
      return Object.entries(storeData).map(([storeName, dailyData]) => ({
        data: dailyData,
        label: storeName,
      }));
    }
    
    case 'hourly': {
      const storeData = {};
      
      // Inicializar todas las tiendas con 0
      stores.forEach(store => {
        storeData[store.name] = Array(24).fill(0);
      });
      
      // Llenar con datos reales
      sales.forEach(item => {
        const storeName = item.store_name;
        const hour = item.hour;
        if (storeData[storeName]) {
          storeData[storeName][hour] = item.count || 0;
        }
      });
      
      return Object.entries(storeData).map(([storeName, hourlyData]) => ({
        data: hourlyData,
        label: storeName,
      }));
    }
    
    default:
      return [];
  }
};

const LineChart = ({ title, data, labels, xText, yText, dataType }) => {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    if (!data) return;
    const processedData = processData(data, dataType, labels);
    setSeries(processedData);
  }, [data, dataType, labels]);

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
