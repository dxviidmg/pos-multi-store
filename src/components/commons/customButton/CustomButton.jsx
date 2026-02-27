import React from "react";
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
      sx={{
        marginTop: '3px',
        marginBottom: '8px',
        whiteSpace: "nowrap",
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
