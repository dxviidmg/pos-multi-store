import { ADD_TO_CART, REMOVE_FROM_CART, CLEAN_CART } from './cartActions';

const initialState = {
  cart: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      console.log(action.payload)
      const { id, quantity, prices, reserved_stock, available_stock, movement_type } = action.payload;
      const existingProductIndex = state.cart.findIndex(item => item.id === id);
      
      // Calcular el precio del producto basado en la cantidad y precios mayoristas
      const calculateProductPrice = (quantity, prices) => {
        if (prices.min_wholesale_quantity == null) {
          return prices.unit_sale_price;
        }

        return quantity >= prices.min_wholesale_quantity
          ? prices.wholesale_sale_price
          : prices.unit_sale_price;
      };

      if (existingProductIndex !== -1) {

        const updatedCart = state.cart.map((item, index) => {
          if (index === existingProductIndex) {
            const stock_temp = item.movement_type === "venta" ? item.available_stock : item.reserved_stock 
            const updatedQuantity = item.quantity < stock_temp ? item.quantity + 1: stock_temp
            const product_price = calculateProductPrice(updatedQuantity, item.prices);
            return { 
              ...item, 
              quantity: updatedQuantity, 
              product_price,
              stock: stock_temp
            };
          }
          return item; // Mantener el producto sin cambios
        });

        return {
          ...state,
          cart: updatedCart,
        };
      }

      // Producto nuevo, agregar al carrito
      const product_price = calculateProductPrice(quantity, prices);

      const stock_temp = movement_type === "venta" ? available_stock : reserved_stock
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, product_price, stock: stock_temp }],
      };
    }

    case REMOVE_FROM_CART: {
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload.id),
      };
    }

    case CLEAN_CART: {
      return {
        ...state,
        cart: [],
      };
    }

    default:
      return state;
  }
};

export default cartReducer;
