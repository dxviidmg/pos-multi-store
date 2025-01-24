import {
  ADD_CLIENT_TO_CART,
  REMOVE_CLIENT_FROM_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAN_CART,
  UPDATE_MOVEMENT_TYPE,
  UPDATE_QUANTITY_IN_CART
} from "./cartActions";

const initialState = {
  cart: [],
  client: {},
  movementType: "venta"
};

const aClientIsSelected = (client) => Object.keys(client).length > 0;

const calculateProductPrice = (quantity, prices, clientSelected) => {
  if (!prices.apply_wholesale_price_on_client_discount && clientSelected) {
    return prices.unit_sale_price;
  }
  if (prices.min_wholesale_quantity && quantity >= prices.min_wholesale_quantity) {
    return prices.wholesale_sale_price;
  }
  return prices.unit_sale_price;
};

const updateCartWithPrice = (cart, clientSelected) => {
  return cart.map((item, index) => ({
    ...item,
    product_price: calculateProductPrice(item.quantity, item.prices, clientSelected)
  }));
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CLIENT_TO_CART: {
      const updatedCart = updateCartWithPrice(state.cart, true);
      return {
        ...state,
        cart: updatedCart,
        client: action.payload,
      };
    }

    case REMOVE_CLIENT_FROM_CART: {
      const updatedCart = updateCartWithPrice(state.cart, false);
      return {
        ...state,
        cart: updatedCart,
        client: {},
      };
    }

    case ADD_TO_CART: {
      const {
        id,
        prices,
        reserved_stock,
        available_stock,
        stock,
      } = action.payload;
      
      const getStockTemp = (movementType) => {
        switch (movementType) {
          case "distribucion":
            return stock;
          case "agregar":
            return available_stock;
          case "venta":
          default:
            return available_stock || reserved_stock;
        }
      };
    
      const stockTemp = getStockTemp(state.movementType);
      const clientSelected = aClientIsSelected(state.client);
      const existingProductIndex = state.cart.findIndex((item) => item.id === id);
    
      if (existingProductIndex !== -1) {
        // Actualizar producto existente
        const updatedCart = state.cart.map((item, index) => {
          if (index === existingProductIndex) {
            const updatedQuantity = state.movementType === "agregar" 
              ? item.quantity + 1 
              : Math.min(item.quantity + 1, stockTemp);
            
            return {
              ...item,
              quantity: updatedQuantity,
              product_price: calculateProductPrice(updatedQuantity, item.prices, clientSelected),
              stock: stockTemp,
            };
          }
          return item;
        });
        return { ...state, cart: updatedCart };
      }
    
      // Agregar nuevo producto
      return {
        ...state,
        cart: [
          ...state.cart,
          {
            ...action.payload,
            product_price: prices.unit_sale_price,
            stock: stockTemp,
          },
        ],
      };
    }
    

    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload.id),
      };

    case CLEAN_CART:
      return { ...state, cart: [] };

    case UPDATE_MOVEMENT_TYPE:
      return { ...state, movementType: action.payload, cart: [] };

    case UPDATE_QUANTITY_IN_CART:
      console.log(action)
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.product.id
            ? { ...item, quantity: action.payload.newQuantity }
            : item
        ),
      };

    default:
      return state;
  }
};

export default cartReducer;
