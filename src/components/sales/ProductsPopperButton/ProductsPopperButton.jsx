import React, { useState, useRef } from "react";
import { Popper, Paper, Box } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomButton from "../../ui/Button/Button";

const ProductsPopperButton = ({ row }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const timeoutRef = useRef(null);
  const buttonRef = useRef(null);
  const open = Boolean(anchorEl);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAnchorEl(buttonRef.current);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setAnchorEl(null), 200);
  };

  return (
    <>
      <CustomButton
        ref={buttonRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <VisibilityIcon />
      </CustomButton>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="right"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Paper elevation={3} className="dropdown-enter" sx={{ maxHeight: '400px', maxWidth: '350px', overflow: 'auto', p: 1.5 }}>
          {row.products_sale?.map((p, i) => (
            <Box
              key={i}
              sx={{ py: 0.5, borderBottom: i < row.products_sale.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}
            >
              {p.quantity} - {p.name} {p.code && `(${p.code})`}
            </Box>
          ))}
        </Paper>
      </Popper>
    </>
  );
};

export default ProductsPopperButton;
