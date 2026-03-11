import React, { useState, useEffect } from "react";
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';
import { Box, Typography } from '@mui/material';

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#ea580c', '#f59e0b', '#06b6d4'];

const processData = (result, dataType, metricType) => {
  if (!result || !result.sales || result.sales.length === 0) return [];

  const { stores, sales } = result;
  const colors = ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#ea580c'];

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
    
    case 'day_of_month': {
      const storeData = {};
      
      stores.forEach(store => {
        storeData[store.name] = Array(31).fill(0);
      });
      
      sales.forEach(item => {
        const date = new Date(item.created_at);
        const day = date.getDate() - 1;
        const storeName = item.store_name;
        if (storeData[storeName] && day >= 0 && day < 31) {
          storeData[storeName][day] += metricType === 'total' ? (item.total || 0) : 1;
        }
      });
      
      return Object.entries(storeData).map(([storeName, dayData], index) => ({
        data: dayData,
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
    
    // Calcular promedio solo si hay más de una tienda
    if (processedData.length > 1) {
      const dataLength = processedData[0].data.length;
      const avgData = Array(dataLength).fill(0);
      
      processedData.forEach(store => {
        store.data.forEach((value, index) => {
          avgData[index] += value;
        });
      });
      
      const average = avgData.map(sum => sum / processedData.length);
      
      setSeries([
        ...processedData,
        {
          data: average,
          label: 'Promedio',
          color: '#94a3b8',
          curve: 'linear',
          showMark: false,
        }
      ]);
    } else {
      setSeries(processedData);
    }
  }, [data, dataType, metricType, labels]);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: '#1e293b' }}>
        {title}
      </Typography>
      <MuiLineChart
        xAxis={[{ 
          data: labels || [],
          scaleType: 'point',
          label: xText,
          labelStyle: { fontSize: 12, fill: '#64748b' },
          tickLabelStyle: { fontSize: 11, fill: '#64748b' },
        }]}
        yAxis={[{ 
          min: 0,
          labelStyle: { fontSize: 12, fill: '#64748b' },
          tickLabelStyle: { fontSize: 11, fill: '#64748b' },
        }]}
        series={series.map(s => ({
          ...s,
          curve: 'linear',
          showMark: true,
          area: false,
        }))}
        height={300}
        margin={{ top: 70, bottom: 50, left: 70, right: 10 }}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'top', horizontal: 'middle' },
            padding: 0,
          }
        }}
        grid={{ vertical: true, horizontal: true }}
        sx={{
          '& .MuiLineElement-root': {
            strokeWidth: 2.5,
          },
          '& .MuiMarkElement-root': {
            scale: '0.8',
            strokeWidth: 2,
          },
        }}
      />
    </Box>
  );
};

export default LineChart;
