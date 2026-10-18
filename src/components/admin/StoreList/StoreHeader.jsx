import React, { memo } from "react";
import { Box, Button, Chip, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";

const NOTICE_COLORS = { error: "error", warning: "warning" };

/** Saludo y título a la izquierda; ampliar plan y crear tienda a la derecha. */
const StoreHeader = ({ title, greeting, notices = [], isOwner, createBlocked, createLabel, onCreate }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2 }}>
    <Box>
      <Typography variant="body1" color="text.secondary">{greeting}</Typography>
      <Typography variant="h1" component="h2" sx={{ mt: 0.25, fontWeight: 600, color: "text.primary" }}>{title}</Typography>
    </Box>

    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
      {notices.map((notice) => (
        <Chip
          key={notice.notice}
          label={notice.notice}
          color={NOTICE_COLORS[notice.variant] || "success"}
          variant="outlined"
          size="small"
        />
      ))}
      {isOwner && (
        <Button
          variant="outlined"
          size="small"
          component={Link}
          to="/mi-plan-actual/"
          startIcon={<AutoAwesomeOutlinedIcon />}
          sx={{ height: 40, bgcolor: "background.paper", color: "text.primary", borderColor: "divider" }}
        >
          Ampliar plan
        </Button>
      )}
      {isOwner && (createBlocked ? (
        <CustomTooltip text="Ya usas todas las tiendas de tu plan" position="bottom">
          <CustomButton disabled startIcon={<LockOutlinedIcon />}>{createLabel}</CustomButton>
        </CustomTooltip>
      ) : (
        <CustomButton onClick={onCreate} startIcon={<AddBusinessOutlinedIcon />}>{createLabel}</CustomButton>
      ))}
    </Box>
  </Box>
);

export default memo(StoreHeader);
