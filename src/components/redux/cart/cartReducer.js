import { ADD_TO_CART, REMOVE_FROM_CART, CLEAN_CART } from './cartActions';

const initialState = {
  cart: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const { id, quantity, prices, reserved_stock, available_stock, movement_type } = action.payload;
      const existingProductIndex = state.cart.findIndex(item => item.id === id);

      // Función para calcular el precio del producto basado en la cantidad y precios mayoristas
      const calculateProductPrice = (quantity, prices) => (
        prices.min_wholesale_quantity && quantity >= prices.min_wholesale_quantity
          ? prices.wholesale_sale_price
          : prices.unit_sale_price
      );

      // Determinar el stock dependiendo del tipo de movimiento
      const stockTemp = movement_type === "compra" ? available_stock : reserved_stock;

      if (existingProductIndex !== -1) {
        const updatedCart = state.cart.map((item, index) => {
          if (index === existingProductIndex) {
            const updatedQuantity = Math.min(item.quantity + 1, stockTemp);
            return {
              ...item,
              quantity: updatedQuantity,
              product_price: calculateProductPrice(updatedQuantity, item.prices),
              stock: stockTemp,
            };
          }
          return item;
        });

        return { ...state, cart: updatedCart };
      }

      // Producto nuevo, agregar al carrito
      return {
        ...state,
        cart: [
          ...state.cart,
          { ...action.payload, product_price: calculateProductPrice(quantity, prices), stock: stockTemp }
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
