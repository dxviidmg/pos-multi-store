import {
  ADD_CLIENT_TO_CART,
  REMOVE_CLIENT_FROM_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAN_CART,
} from "./cartActions";

const initialState = {
  cart: [],
  client: {},
};

const aClientIsSelected = (client) => Object.keys(client).length > 0;

const calculateProductPrice = (quantity, prices, clientSelected) => {
  if (!prices.apply_wholesale_price_on_costumer_discount && clientSelected) {
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
        quantity,
        prices,
        reserved_stock,
        available_stock,
        movement_type,
      } = action.payload;
      const existingProductIndex = state.cart.findIndex((item) => item.id === id);
      const stockTemp = movement_type === "compra" ? available_stock : reserved_stock;
      const clientSelected = aClientIsSelected(state.client);

      if (existingProductIndex !== -1) {
        const updatedCart = state.cart.map((item, index) => {
          if (index === existingProductIndex) {
            const updatedQuantity = Math.min(item.quantity + 1, stockTemp);
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

    default:
      return state;
  }
};

export default cartReducer;
