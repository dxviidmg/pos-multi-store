import React from "react";
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { Box, Typography } from '@mui/material';

const processData = (result, dataType, metricType, daysInMonth = 31) => {
  if (!result || !result.sales || result.sales.length === 0) return [];

  const { stores, sales } = result;
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

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
        storeData[store.name] = Array(daysInMonth).fill(0);
      });
      
      sales.forEach(item => {
        const date = new Date(item.created_at);
        const day = date.getDate() - 1;
        const storeName = item.store_name;
        if (storeData[storeName] && day >= 0 && day < daysInMonth) {
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

const LineChart = ({ title, data, labels, xText, yText, dataType, metricType = 'count', todayLabel }) => {
  const series = React.useMemo(() => {
    if (!data) return [];
    const daysInMonth = labels?.length || 31;
    const processedData = processData(data, dataType, metricType, daysInMonth);

    if (processedData.length > 1) {
      const dataLength = processedData[0].data.length;
      const avgData = Array(dataLength).fill(0);
      processedData.forEach(store => {
        store.data.forEach((value, index) => { avgData[index] += value; });
      });
      const average = avgData.map(sum => sum / processedData.length);
      return [
        ...processedData,
        { data: average, label: 'Promedio', color: '#94a3b8', curve: 'linear', showMark: false },
      ];
    }
    return processedData;
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
          curve: 'catmullRom',
          showMark: true,
          area: false,
        }))}
        height={300}
        margin={{ top: 50, bottom: 50, left: 70, right: 10 }}
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
      >
        {todayLabel && <ChartsReferenceLine x={todayLabel} lineStyle={{ stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '6 3' }} labelStyle={{ fill: '#ef4444', fontSize: 11, fontWeight: 600 }} label="Hoy" />}
      </MuiLineChart>
    </Box>
  );
};

export default LineChart;
