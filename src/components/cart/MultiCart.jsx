import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Tab, IconButton, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Cart from "./Cart";
import { createNewCart, switchCart, closeCart } from "../../redux/cart/multiCartReducer";

const MultiCart = () => {
  const dispatch = useDispatch();
  const { carts, activeCartId } = useSelector((state) => state.multiCartReducer);
  
  const movementType = useSelector((state) => {
    const { carts, activeCartId } = state.multiCartReducer;
    const activeCart = carts?.find(c => c.id === activeCartId) || carts?.[0];
    return activeCart?.movementType || "venta";
  });

  const handleTabChange = (event, newValue) => {
    if (newValue === "add") {
      if (movementType === "venta") {
        dispatch(createNewCart());
      }
    } else {
      dispatch(switchCart(newValue));
    }
  };

  const handleCloseCart = (cartId, event) => {
    event.stopPropagation();
    if (carts.length > 1) {
      dispatch(closeCart(cartId));
    }
  };

  const getCartLabel = (cart) => {
    const itemCount = cart.cart.length;
    const clientName = cart.client?.first_name || "";
    const movementLabel = cart.movementType.charAt(0).toUpperCase() + cart.movementType.slice(1);
    
    if (clientName) {
      return `${clientName} (${itemCount})`;
    }
    return `${movementLabel} ${cart.id} (${itemCount})`;
  };

  return (
    <Box>
      <Tabs
        value={activeCartId}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        {carts.map((cart) => (
          <Tab
            key={cart.id}
            value={cart.id}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getCartLabel(cart)}
                {carts.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleCloseCart(cart.id, e)}
                    sx={{ ml: 0.5, p: 0.5 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            }
          />
        ))}
        <Tab
          value="add"
          icon={<AddIcon />}
          sx={{ minWidth: 50 }}
          disabled={movementType !== "venta"}
        />
      </Tabs>
      
      <Cart />
    </Box>
  );
};

export default MultiCart;
