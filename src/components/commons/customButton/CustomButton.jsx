import React from 'react';
import { Button } from 'react-bootstrap';



const CustomButton = ({ text, children, onClick, size = "sm", disabled = false, href, ...props }) => {
  return (
    <Button
      onClick={onClick}
      size={size}
      disabled={disabled}
      href={href}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
