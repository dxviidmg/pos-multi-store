import { ADD_TO_CART, REMOVE_FROM_CART } from './cartActions';

const initialState = {
  cart: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const existingProduct = state.cart.find(item => item.id === action.payload.id);

      if (existingProduct) {
        // Si el producto ya existe, actualizar la cantidad
        const updatedCart = state.cart.map(item =>
          item.id === existingProduct.id
            ? { ...item, quantity: (item.quantity || 1) + 1 } // Aumentar la cantidad
            : item
        );

        return {
          ...state,
          cart: updatedCart,
        };
      }

      // Agregar producto nuevo al carrito con cantidad inicial de 1
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    }

    case REMOVE_FROM_CART: {
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload.id),
      };
    }

    default:
      return state;
  }
};

export default cartReducer;
