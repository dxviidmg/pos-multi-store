import React, { memo } from "react";
import { Button } from "@mui/material";

const CustomButton = ({
  children,
  onClick,
  size = "small",
  disabled = false,
  href,
  fullWidth = false,
  ...props
}) => {
  return (
    <Button
      onClick={onClick}
      size={size}
      disabled={disabled}
      href={href}
      fullWidth={fullWidth}
      variant="contained"
      
      {...props}
    >
      {children}
    </Button>
  );
};

export default memo(CustomButton);
