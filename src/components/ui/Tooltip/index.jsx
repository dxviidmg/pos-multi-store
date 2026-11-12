import { memo } from "react";
import { Box, Tooltip } from "@mui/material";

export const CustomTooltip = memo(({ children, text, position, fullWidth }) => {
  return (
    <Tooltip title={text} placement={position || "right"} arrow>
      <Box component="span" sx={{ display: fullWidth ? 'block' : 'inline-block' }}>
        {children}
      </Box>
    </Tooltip>
  );
});

export default CustomTooltip;
