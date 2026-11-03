import React, { memo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import StatusChip from "../../ui/StatusChip";
import { STATUS_TONES } from "../../../constants";

const NOTICE_TONES = { error: STATUS_TONES.ERROR, warning: STATUS_TONES.WARNING };

/** Saludo, título y avisos a la izquierda; ampliar plan y crear tienda ocupan 1/4 cada uno. */
const StoreHeader = ({ title, greeting, notices = [], isOwner, createBlocked, createLabel, onCreate }) => (
  <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
    <Grid item xs={12} md={6}>
      <Typography variant="body1" color="text.secondary">{greeting}</Typography>
      <Typography variant="h1" component="h2" sx={{ mt: 0.25, fontWeight: 600, color: "text.primary" }}>{title}</Typography>
      {notices.length > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mt: 1 }}>
          {notices.map((notice) => (
            <StatusChip
              key={notice.notice}
              label={notice.notice}
              tone={NOTICE_TONES[notice.variant] || STATUS_TONES.SUCCESS}
            />
          ))}
        </Box>
      )}
    </Grid>

    {isOwner && (
      <Grid item xs={6} md={3}>
        <CustomButton
          fullWidth
          variant="outlined"
          component={Link}
          to="/mi-plan-actual/"
          startIcon={<AutoAwesomeOutlinedIcon />}
          sx={{ bgcolor: "background.paper", color: "text.primary", borderColor: "divider" }}
        >
          Ampliar plan
        </CustomButton>
      </Grid>
    )}
    {isOwner && (
      <Grid item xs={6} md={3}>
        {createBlocked ? (
          <CustomTooltip text="Ya usas todas las tiendas de tu plan" position="bottom" fullWidth>
            <CustomButton fullWidth disabled startIcon={<LockOutlinedIcon />}>{createLabel}</CustomButton>
          </CustomTooltip>
        ) : (
          <CustomButton fullWidth onClick={onCreate} startIcon={<AddBusinessOutlinedIcon />}>{createLabel}</CustomButton>
        )}
      </Grid>
    )}
  </Grid>
);

export default memo(StoreHeader);
