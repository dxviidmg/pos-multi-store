import React from 'react';
import { Button } from 'react-bootstrap';

const CustomButton = ({ text, children, onClick, size = "sm", disabled = false, href, fullWidth = false, marginTop="5px", ...props }) => {
  return (
    <Button
      onClick={onClick}
      size={size}
      disabled={disabled}
      href={href}
      style={{
        width: fullWidth ? '100%' : 'auto',
        marginBottom: '3px',
        marginTop: marginTop
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
