import { ADD_TO_CART, REMOVE_FROM_CART } from './cartActions';

const initialState = {
  cart: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const { id, quantity, prices } = action.payload;
      const existingProductIndex = state.cart.findIndex(item => item.id === id);
      console.log(existingProductIndex)
    
      if (existingProductIndex !== -1) {
        // Si el producto ya existe, actualizar la cantidad y recalcular el precio
        const updatedCart = state.cart.map((item, index) => {
          if (index === existingProductIndex) {
            const updatedQuantity = item.quantity + 1;
            
            var product_price = updatedQuantity >= item.prices.min_wholesale_quantity 
              ? item.prices.wholesale_sale_price 
              : item.prices.unit_sale_price;
            
            if (!product_price){
              product_price = item.prices.unit_sale_price
            }
              
              console.log('product_price', product_price)
            return { 
              ...item, 
              quantity: updatedQuantity, 
              product_price 
            };
          }
    
          return item; // Devolver el producto sin modificar
        });
    
        return {
          ...state,
          cart: updatedCart,
        };
      }
    
      // Si el producto no existe, agregarlo con la cantidad y precio correctos
      var product_price = quantity >= prices.min_wholesale_quantity 
        ? prices.wholesale_sale_price 
        : prices.unit_sale_price;

        if (!product_price){
          product_price = prices.unit_sale_price
        }

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

    default:
      return state;
  }
};

export default cartReducer;
