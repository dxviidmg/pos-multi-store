import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveCartId, selectCarts, selectMovementType } from "../../../redux/cart/selectors";
import { Tabs, Tab, IconButton, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { MOVEMENT_TYPES } from "../../../constants";
import CloseIcon from "@mui/icons-material/Close";
import CustomTooltip from "../../ui/Tooltip";
import Cart from "./Cart";
import { createNewCart, switchCart, closeCart } from "../../../redux/cart/cartActions";

// Pestañas como chips (sin línea inferior ni indicador); la activa va rellena
const CHIP_TABS_SX = {
  mb: 1.5,
  minHeight: 36,
  "& .MuiTabs-indicator": { display: "none" },
  "& .MuiTabs-flexContainer": { gap: 1 },
  "& .MuiTab-root": {
    minHeight: 36, minWidth: 0, px: 1.5, py: 0.5, borderRadius: 1, border: "1px solid", borderColor: "divider", fontSize: "0.8125rem",
  },
  "& .MuiTab-root.Mui-selected": { bgcolor: "primary.main", borderColor: "primary.main", color: "common.white" },
  "& .MuiTab-root.Mui-disabled": { opacity: 0.5 },
};

const MultiCart = ({ searchInputRef, cartViewMode, setCartViewMode }) => {
  const dispatch = useDispatch();
  const carts = useSelector(selectCarts);
  const activeCartId = useSelector(selectActiveCartId);
  const movementType = useSelector(selectMovementType);

  const handleTabChange = (event, newValue) => {
    if (newValue === "add") {
      if (movementType === MOVEMENT_TYPES.SALE) {
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
        sx={CHIP_TABS_SX}
      >
        {carts.map((cart) => (
          <Tab
            key={cart.id}
            value={cart.id}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getCartLabel(cart)}
                {carts.length > 1 && (
                  <CustomTooltip text="Cerrar carrito" position="top">
                    <IconButton
                      size="small"
                      aria-label="Cerrar carrito"
                      onClick={(e) => handleCloseCart(cart.id, e)}
                      sx={{ ml: 0.5, p: 0.5, color: "inherit" }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </CustomTooltip>
                )}
              </Box>
            }
          />
        ))}
        <Tab
          value="add"
          icon={<AddIcon />}
                    disabled={movementType !== MOVEMENT_TYPES.SALE}
        />
      </Tabs>
      
      <Cart searchInputRef={searchInputRef} cartViewMode={cartViewMode} setCartViewMode={setCartViewMode} />
    </Box>
  );
};

export default MultiCart;
