import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveCartId, selectCarts, selectMovementType } from "../../../redux/cart/selectors";
import { Tabs, Tab, IconButton, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { MOVEMENT_TYPES } from "../../../constants";
import CloseIcon from "@mui/icons-material/Close";
import CustomTooltip from "../../ui/Tooltip";
import Cart from "./Cart";
import { createNewCart, switchCart, closeCart } from "../../../redux/cart/cartActions";

// Bloque de la venta: franja de pestañas arriba y, debajo, el resumen y la tabla del carrito
const CART_PANEL_SX = {
  mt: 3,
  bgcolor: "background.paper",
  borderStyle: "solid",
  borderWidth: { xs: 0, md: 1 },
  borderColor: "divider",
  borderRadius: "var(--radius-base)",
  overflow: "hidden",
  "& .MuiTableContainer-root": { border: 0, borderTop: "1px solid", borderColor: "divider", borderRadius: 0 },
};

const CHIP_TABS_SX = {
  minHeight: 0,
  p: 0,
  m: 0,
  bgcolor: "background.paper",
  borderStyle: "solid",
  borderWidth: { xs: 0, md: "0 0 1px" },
  borderColor: "divider",
  "& .MuiTabs-indicator": { display: "none" },
  "& .MuiTabs-flexContainer": { gap: 0 },
  "& .MuiTab-root": {
    minHeight: 40, minWidth: 0, m: 0, px: 1.5, py: 0, borderRadius: 0, fontSize: "0.8125rem", color: "text.secondary",
    "&:hover": { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06) },
  },
  "& .MuiTab-root.Mui-selected": { color: "primary.main", bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) },
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
    <Box sx={CART_PANEL_SX}>
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
