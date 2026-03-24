import { memo } from "react";
import { Tooltip } from "@mui/material";

export const CustomTooltip = memo(({ children, text, position, fullWidth }) => {
  return (
    <Tooltip title={text} placement={position || "right"} arrow>
      <span style={{ display: fullWidth ? 'block' : 'inline-block' }}>
        {children}
      </span>
    </Tooltip>
  );
});

export default CustomTooltip;
