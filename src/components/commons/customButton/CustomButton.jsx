import React from "react";
import { Button } from "react-bootstrap";

const CustomButton = ({
  children,
  onClick,
  size = "sm",
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
      className={`custom-button d-inline-flex align-items-center justify-content-center ${fullWidth ? "w-100" : ""} mb-1 mx-1`}
      style={{
        marginTop: '3px',
        backgroundColor: "#04356b !important",
        whiteSpace: "nowrap",
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
