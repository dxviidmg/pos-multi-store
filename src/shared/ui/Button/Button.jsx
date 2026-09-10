import React, { memo, forwardRef } from "react";
import { Button } from "@mui/material";

const CustomButton = forwardRef(({
  children,
  onClick,
  size = "small",
  disabled = false,
  href,
  fullWidth = false,
  ...props
}, ref) => {
  return (
    <Button
      ref={ref}
      onClick={onClick}
      size={size}
      disabled={disabled}
      href={href}
      fullWidth={fullWidth}
      variant="contained"
      sx={{ minWidth: 0, ...props.sx }}
      {...props}
    >
      {children}
    </Button>
  );
});

CustomButton.displayName = 'CustomButton';

export default memo(CustomButton);
