import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const KPICard = ({ title, value, subtitle, trend, icon: Icon }) => {
  return (
    <Paper elevation={2} sx={{ p: 2.5, height: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          {trend !== undefined && trend !== 0 && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 0.5 }}>
              {trend > 0 ? (
                <TrendingUpIcon sx={{ fontSize: 18, color: "success.main" }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 18, color: "error.main" }} />
              )}
              <Typography
                variant="body2"
                sx={{ color: trend > 0 ? "success.main" : "error.main" }}
              >
                {Math.abs(trend).toFixed(1)}%
              </Typography>
            </Box>
          )}
        </Box>
        {Icon && (
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 1.5,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ fontSize: 28 }} />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default KPICard;
