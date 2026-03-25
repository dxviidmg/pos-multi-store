import React, { useState, useEffect } from "react";
import CustomModal from "../../ui/Modal/Modal";
import { Grid, Typography, Box, Chip } from "@mui/material";
import { getUserData } from "../../../api/utils";
import updates from "../../../constants/smartventa_2_0_updates.json";

const UpdatesModal = () => {
  const [open, setOpen] = useState(false);
  const user = getUserData();
  const storageKey = `smartventa_updates_seen_2_0_${user?.username || ""}`;

  useEffect(() => {
    if (!localStorage.getItem(storageKey)) setOpen(true);
  }, [storageKey]);

  const handleClose = () => {
    localStorage.setItem(storageKey, "true");
    setOpen(false);
  };

  const role = user?.role || "seller";
  const sections = [...updates.updates.all, ...(updates.updates[role] || [])];

  if (!open) return null;

  return (
    <CustomModal showOut={open} onClose={handleClose} title="🎉 Novedades SmartVenta 2.0">
      <Grid container sx={{ padding: '1rem', backgroundColor: 'rgba(4, 53, 107, 0.2)' }}>
        <Grid item xs={12} className="card" sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          {sections.map((s, i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                {s.section}
              </Typography>
              {s.items.map((item, j) => (
                <Typography key={j} variant="body2" sx={{ pl: 1, py: 0.3 }}>
                  • {item}
                </Typography>
              ))}
            </Box>
          ))}
          {updates.renamed.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>Cambios de nombres</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {updates.renamed.map((r, i) => (
                  <Chip key={i} label={`${r.before} → ${r.after}`} size="small" />
                ))}
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default UpdatesModal;
