import { memo } from "react";
import { Tooltip } from "@mui/material";

export const CustomTooltip = memo(({ children, text, position }) => {
  return (
    <Tooltip title={text} placement={position || "right"} arrow>
      <span style={{ display: 'inline-block', width: '100%' }}>
        {children}
      </span>
    </Tooltip>
  );
});

export default CustomTooltip;
