import React from "react";
import { Button } from "react-bootstrap";

const CustomButton = ({
  children,
  onClick,
  size = "sm",
  disabled = false,
  href,
  fullWidth = false,
  marginTop = "5px",
  ...props
}) => {
  return (
    <Button
      className="custom-button"
      onClick={onClick}
      size={size}
      disabled={disabled}
      href={href}
      style={{
        width: fullWidth ? "100%" : "auto",
        marginBottom: "3px",
        marginTop: marginTop,
        backgroundColor: "#04356b !important",
        marginLeft: fullWidth ? "0px" : "5px",
        marginRight: fullWidth ? "0px" : "5px",
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
