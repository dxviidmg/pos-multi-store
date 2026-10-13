import React, { memo } from "react";
import { Box, Chip, Link as MuiLink, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import CustomButton from "../../ui/Button/Button";

const NOTICE_COLORS = { error: "error", warning: "warning" };

/** Título y saludo a la izquierda; avisos y acción principal a la derecha. */
const StoreHeader = ({ title, greeting, notices = [], canCreate, createBlocked, onCreate }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 2, mb: 3 }}>
    <Box>
      <Typography variant="h2" component="h2">{title}</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>{greeting}</Typography>
    </Box>

    <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "flex-start", md: "flex-end" }, gap: 1 }}>
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
        {canCreate && (
          <CustomButton onClick={onCreate} startIcon={<AddBusinessOutlinedIcon />} disabled={createBlocked}>
            Crear tienda
          </CustomButton>
        )}
      </Box>
      {canCreate && createBlocked && (
        <Typography variant="caption" sx={{ maxWidth: 320, textAlign: { md: "right" } }}>
          Ya tienes todas las tiendas que incluye tu plan. Si necesitas otra, puedes ampliarlo en{" "}
          <MuiLink component={Link} to="/mi-plan-actual/">Mi plan</MuiLink>.
        </Typography>
      )}
    </Box>
  </Box>
);

export default memo(StoreHeader);
