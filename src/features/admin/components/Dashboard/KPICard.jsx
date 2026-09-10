import React from "react";
import { Box, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const gradients = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  "linear-gradient(135deg, #a78bfa 0%, #7c5cbf 100%)",
  "linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)",
  "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
];

const KPICard = ({ title, value, subtitle, trend, icon: Icon, index = 0 }) => {
  const gradient = gradients[index % gradients.length];

  return (
    <Box sx={{ height: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
          )}
          {trend !== undefined && trend !== 0 && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 0.5 }}>
              {trend > 0 ? (
                <TrendingUpIcon sx={{ fontSize: 18, color: "success.main" }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 18, color: "error.main" }} />
              )}
              <Typography variant="body2" sx={{ color: trend > 0 ? "success.main" : "error.main", fontWeight: 600 }}>
                {Math.abs(trend).toFixed(1)}%
              </Typography>
            </Box>
          )}
        </Box>
        {Icon && (
          <Box sx={{
            background: gradient,
            color: "white", p: 1.5, borderRadius: 2.5,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          }}>
            <Icon sx={{ fontSize: 26 }} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default KPICard;
