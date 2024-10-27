import { ADD_TO_CART, REMOVE_FROM_CART, CLEAN_CART } from './cartActions';

const initialState = {
  cart: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const { id, quantity, prices, stock } = action.payload;
      console.log('stock en add to cart', stock)
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
        // Producto existente, incrementar cantidad y recalcular precio
        const updatedCart = state.cart.map((item, index) => {
          if (index === existingProductIndex) {

            const updatedQuantity = item.quantity < item.stock ? item.quantity + 1: item.stock
            const product_price = calculateProductPrice(updatedQuantity, item.prices);
            console.log('product_price 2', product_price)
            return { 
              ...item, 
              quantity: updatedQuantity, 
              product_price,
              stock 
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
      console.log('product_price nuevo', product_price)
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, product_price }],
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
