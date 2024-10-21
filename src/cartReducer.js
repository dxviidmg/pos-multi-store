import { ADD_TO_CART, REMOVE_FROM_CART } from './cartActions';

const initialState = {
  cart: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const { id } = action.payload; // Extraer cantidad del payload
      const existingProductIndex = state.cart.findIndex(item => item.id === id);

      if (existingProductIndex !== -1) {
        // Si el producto ya existe, actualizar la cantidad sumando la del item existente
        const updatedCart = state.cart.map((item, index) => 
          index === existingProductIndex
            ? { ...item, quantity: item.quantity + 1 } // Aumentar la cantidad desde el item
            : item
        );

        return {
          ...state,
          cart: updatedCart,
        };
      }

      // Agregar producto nuevo al carrito con la cantidad que viene del payload
      return {
        ...state,
        cart: [...state.cart, { ...action.payload }], // No establecer cantidad aquí, ya que viene del payload
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
