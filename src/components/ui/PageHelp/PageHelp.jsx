import { memo, useState } from "react";
import { IconButton, Popover, Typography, Box } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useLocation } from "react-router-dom";
import helpTexts from "../../../constants/helpTexts";

const PageHelp = memo(() => {
  const { pathname } = useLocation();
  const help = helpTexts[pathname];
  const [anchorEl, setAnchorEl] = useState(null);

  if (!help) return null;

  return (
    <>
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
        <HelpOutlineIcon />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { maxWidth: 400, borderRadius: 1.5, overflow: "hidden", bgcolor: "#DBE0E8" } } }}
      >
        <Box sx={{ px: 2.5, py: 2 }}>
          <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.7 }}>
            {help.text}
          </Typography>
        </Box>
      </Popover>
    </>
  );
});

PageHelp.displayName = "PageHelp";

export default PageHelp;
