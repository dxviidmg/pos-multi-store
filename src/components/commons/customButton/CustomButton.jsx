import React from 'react';
import { Button } from 'react-bootstrap';
import './customButton.css'


const CustomButton = ({children, onClick, size = "sm", disabled = false, href, fullWidth = false, marginTop="5px", ...props }) => {
  return (
    <Button
    className='custom-button'
      onClick={onClick}
      size={size}
      disabled={disabled}
      href={href}
      style={{
        width: fullWidth ? '100%' : 'auto',
        marginBottom: '3px',
        marginTop: marginTop,
        marginLeft: '5px',
        marginRight: '5px',
        backgroundColor: "#04356b !important" 
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
