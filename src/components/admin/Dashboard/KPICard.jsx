import React from "react";
import { Box, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { colors } from "../../../theme";

const gradients = colors.gradient.kpi;

const KPICard = ({ title, value, subtitle, trend, icon: Icon, index = 0 }) => {
  const gradient = gradients[index % gradients.length];

  return (
    <Box className="fade-in-up" sx={{ height: "100%", animationDelay: `${index * 60}ms` }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, fontVariantNumeric: "tabular-nums" }}>
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
            color: "common.white", p: 1.5, borderRadius: 1.5,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: colors.shadow.brand,
          }}>
            <Icon sx={{ fontSize: 26 }} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default KPICard;
