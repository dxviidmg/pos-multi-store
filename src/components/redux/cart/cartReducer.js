import { ADD_CLIENT_TO_CART, REMOVE_CLIENT_FROM_CART, ADD_TO_CART, REMOVE_FROM_CART, CLEAN_CART } from './cartActions';

const initialState = {
  cart: [],
  client: {}
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CLIENT_TO_CART: {
      return {
        ...state,
        client: action.payload,
      };
    }

    case REMOVE_CLIENT_FROM_CART: {
      return {
        ...state,
        client: {},
      };
    }

    case ADD_TO_CART: {
      const { id, quantity, prices, reserved_stock, available_stock, movement_type, aClientIsSelected } = action.payload;
      const existingProductIndex = state.cart.findIndex(item => item.id === id);
      console.log(action.payload)

      // Función para calcular el precio del producto basado en la cantidad y precios mayoristas
      const calculateProductPrice = (quantity, prices, aClientIsSelected) => {

        if (!prices.apply_wholesale_price_on_costumer_discount && aClientIsSelected) {
          return prices.unit_sale_price;
        }

        if (prices.min_wholesale_quantity && quantity >= prices.min_wholesale_quantity) {
          return prices.wholesale_sale_price; // Aplica el precio mayorista
      }

      return prices.unit_sale_price;

    };

      // Determinar el stock dependiendo del tipo de movimiento
      const stockTemp = movement_type === "compra" ? available_stock : reserved_stock;

      if (existingProductIndex !== -1) {
        const updatedCart = state.cart.map((item, index) => {
          if (index === existingProductIndex) {
            const updatedQuantity = Math.min(item.quantity + 1, stockTemp);
            return {
              ...item,
              quantity: updatedQuantity,
              product_price: calculateProductPrice(updatedQuantity, item.prices, item.aClientIsSelected),
              stock: stockTemp,
            };
          }
          return item;
        });

        return { ...state, cart: updatedCart };
      }

      // Producto nuevo, agregar al carrito

      console.log('soy nuevo', aClientIsSelected)
      return {
        ...state,
        cart: [
          ...state.cart,
          { ...action.payload, product_price: calculateProductPrice(quantity, prices, aClientIsSelected), stock: stockTemp }
        ],
      };
    }

    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload.id),
      };

    case CLEAN_CART:
      return { ...state, cart: [] };

    default:
      return state;
  }
};

export default cartReducer;
