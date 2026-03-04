import {
  ADD_CLIENT_TO_CART,
  REMOVE_CLIENT_FROM_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAN_CART,
  UPDATE_MOVEMENT_TYPE,
  UPDATE_QUANTITY_IN_CART,
  CHANGE_PRICE,
  COUNT_STOCK_OTHER_STORES
} from "./cartActions";

// Nuevas acciones para multi-cart
export const CREATE_NEW_CART = "CREATE_NEW_CART";
export const SWITCH_CART = "SWITCH_CART";
export const CLOSE_CART = "CLOSE_CART";

export const createNewCart = () => ({ type: CREATE_NEW_CART });
export const switchCart = (cartId) => ({ type: SWITCH_CART, payload: cartId });
export const closeCart = (cartId) => ({ type: CLOSE_CART, payload: cartId });

const createEmptyCart = (id) => ({
  id,
  cart: [],
  client: {},
  movementType: "venta",
  createdAt: Date.now()
});

const initialState = {
  carts: [createEmptyCart(1)],
  activeCartId: 1,
  nextId: 2
};

const aClientIsSelected = (client) => Object.keys(client).length > 0;

const calculateProductPrice = (quantity, prices, clientSelected) => {
  if (!prices.wholesale_price_on_client_discount && clientSelected) {
    return prices.unit_price;
  }
  if (prices.min_wholesale_quantity && quantity >= prices.min_wholesale_quantity) {
    return prices.wholesale_price;
  }
  return prices.unit_price;
};

const changeProductPrice = (product_price, prices) => {
  if (product_price === prices.wholesale_price) {
    return prices.unit_price;
  }
  return prices.wholesale_price;
};

const updateCartWithPrice = (cart, clientSelected) => {
  return cart.map((item) => ({
    ...item,
    product_price: calculateProductPrice(item.quantity, item.product.prices, clientSelected)
  }));
};

// Función para calcular stock reservado de un producto en todos los carritos
const getReservedStock = (carts, productId, excludeCartId = null) => {
  return carts.reduce((total, cart) => {
    if (cart.id === excludeCartId) return total;
    const item = cart.cart.find(item => item.id === productId);
    return total + (item ? item.quantity : 0);
  }, 0);
};

const multiCartReducer = (state = initialState, action) => {
  const activeCart = state.carts.find(c => c.id === state.activeCartId);
  
  switch (action.type) {
    case CREATE_NEW_CART: {
      const newCart = createEmptyCart(state.nextId);
      return {
        ...state,
        carts: [...state.carts, newCart],
        activeCartId: state.nextId,
        nextId: state.nextId + 1
      };
    }

    case SWITCH_CART: {
      return {
        ...state,
        activeCartId: action.payload
      };
    }

    case CLOSE_CART: {
      const remainingCarts = state.carts.filter(c => c.id !== action.payload);
      if (remainingCarts.length === 0) {
        remainingCarts.push(createEmptyCart(state.nextId));
      }
      return {
        ...state,
        carts: remainingCarts,
        activeCartId: remainingCarts[0].id,
        nextId: remainingCarts.length === 1 && remainingCarts[0].id === state.nextId ? state.nextId + 1 : state.nextId
      };
    }

    case ADD_CLIENT_TO_CART: {
      const updatedCart = updateCartWithPrice(activeCart.cart, true);
      return {
        ...state,
        carts: state.carts.map(c => 
          c.id === state.activeCartId 
            ? { ...c, client: action.payload, cart: updatedCart }
            : c
        )
      };
    }

    case REMOVE_CLIENT_FROM_CART: {
      const updatedCart = updateCartWithPrice(activeCart.cart, false);
      return {
        ...state,
        carts: state.carts.map(c => 
          c.id === state.activeCartId 
            ? { ...c, client: {}, cart: updatedCart }
            : c
        )
      };
    }

    case ADD_TO_CART: {
      const existingProductIndex = activeCart.cart.findIndex(
        (item) => item.id === action.payload.id
      );

      // Calcular stock ya reservado en otros carritos
      const reservedInOtherCarts = getReservedStock(state.carts, action.payload.id, state.activeCartId);
      const productStock = activeCart.movementType === "traspaso" 
        ? action.payload.reserved_stock 
        : action.payload.available_stock;
      const availableStock = productStock - reservedInOtherCarts;

      let updatedCart;
      if (existingProductIndex !== -1) {
        const currentQuantity = activeCart.cart[existingProductIndex].quantity;
        const newQuantity = currentQuantity + action.payload.quantity;
        
        // Verificar que no exceda el stock disponible
        if (newQuantity > availableStock) {
          console.warn(`Stock insuficiente. Disponible: ${availableStock}, Intentando agregar: ${newQuantity}`);
          return state; // No agregar si excede el stock
        }
        
        updatedCart = activeCart.cart.map((item, index) =>
          index === existingProductIndex
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Verificar stock disponible para nuevo producto
        if (action.payload.quantity > availableStock) {
          console.warn(`Stock insuficiente. Disponible: ${availableStock}, Intentando agregar: ${action.payload.quantity}`);
          return state;
        }
        
        const clientSelected = aClientIsSelected(activeCart.client);
        const product_price = calculateProductPrice(
          action.payload.quantity,
          action.payload.product.prices,
          clientSelected
        );
        updatedCart = [...activeCart.cart, { ...action.payload, product_price }];
      }

      return {
        ...state,
        carts: state.carts.map(c => 
          c.id === state.activeCartId 
            ? { ...c, cart: updatedCart }
            : c
        )
      };
    }

    case REMOVE_FROM_CART: {
      const updatedCart = activeCart.cart.filter((item) => item.id !== action.payload);
      return {
        ...state,
        carts: state.carts.map(c => 
          c.id === state.activeCartId 
            ? { ...c, cart: updatedCart }
            : c
        )
      };
    }

    case CLEAN_CART: {
      return {
        ...state,
        carts: state.carts.map(c => 
          c.id === state.activeCartId 
            ? { ...c, cart: [], client: {} }
            : c
        )
      };
    }

    case UPDATE_MOVEMENT_TYPE: {
      return {
        ...state,
        carts: state.carts.map(c => 
          c.id === state.activeCartId 
            ? { ...c, movementType: action.payload }
            : c
        )
      };
    }

    case UPDATE_QUANTITY_IN_CART: {
      // Calcular stock reservado en otros carritos
      const reservedInOtherCarts = getReservedStock(state.carts, action.payload.product.id, state.activeCartId);
      const productStock = activeCart.movementType === "traspaso" 
        ? action.payload.product.reserved_stock 
        : action.payload.product.available_stock;
      const availableStock = productStock - reservedInOtherCarts;
      
      // Limitar la cantidad al stock disponible
      const requestedQuantity = action.payload.newQuantity;
      if (requestedQuantity > availableStock) {
        console.warn(`Stock insuficiente. Disponible: ${availableStock}, Solicitado: ${requestedQuantity}`);
        // Permitir actualizar hasta el máximo disponible
        action.payload.newQuantity = Math.max(1, availableStock);
      }
      
      const updatedCart = activeCart.cart.map((item) => {
        if (item.id === action.payload.product.id) {
          const clientSelected = aClientIsSelected(activeCart.client);
          const product_price = calculateProductPrice(
            action.payload.newQuantity,
            item.product.prices,
            clientSelected
          );
          return { ...item, quantity: action.payload.newQuantity, product_price };
        }
        return item;
      });

      return {
        ...state,
        carts: state.carts.map(c => 
          c.id === state.activeCartId 
            ? { ...c, cart: updatedCart }
            : c
        )
      };
    }

    case CHANGE_PRICE: {
      const updatedCart = activeCart.cart.map((item) =>
        item.id === action.payload.id
          ? {
              ...item,
              product_price: changeProductPrice(
                item.product_price,
                item.product.prices
              ),
            }
          : item
      );

      return {
        ...state,
        carts: state.carts.map(c => 
          c.id === state.activeCartId 
            ? { ...c, cart: updatedCart }
            : c
        )
      };
    }

    case COUNT_STOCK_OTHER_STORES: {
      const updatedCart = activeCart.cart.map((item) =>
        item.id === action.payload.id
          ? { ...item, stock_other_stores: action.payload.stock_other_stores }
          : item
      );

      return {
        ...state,
        carts: state.carts.map(c => 
          c.id === state.activeCartId 
            ? { ...c, cart: updatedCart }
            : c
        )
      };
    }

    default:
      return state;
  }
};

export default multiCartReducer;
