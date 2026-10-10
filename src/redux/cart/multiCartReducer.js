import { logger } from "../../utils/logger";
import {
  ADD_CLIENT_TO_CART,
  REMOVE_CLIENT_FROM_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAN_CART,
  UPDATE_MOVEMENT_TYPE,
  UPDATE_QUANTITY_IN_CART,
  CHANGE_PRICE,
  COUNT_STOCK_OTHER_STORES,
  CREATE_NEW_CART,
  SWITCH_CART,
  CLOSE_CART,
} from "./cartActions";
import { MOVEMENT_TYPES } from "../../constants";
import {
  aClientIsSelected,
  calculateProductPrice,
  changeProductPrice,
  updateCartWithPrice,
} from "./priceCalculators";
import {
  getReservedStock,
  getAvailableStockForActiveCart,
} from "./stockCalculators";

const createEmptyCart = (id) => ({
  id,
  cart: [],
  client: {},
  movementType: MOVEMENT_TYPES.SALE,
  createdAt: Date.now()
});

const initialState = {
  carts: [createEmptyCart(1)],
  activeCartId: 1,
  nextId: 2
};

/**
 * Exportamos getReservedStock para que hooks como useAvailableStock lo reutilicen.
 * La implementación está en stockCalculators.js
 */
export { getReservedStock };

// Agrega un producto nuevo al carrito con el precio que le corresponde
const appendNewItem = (activeCart, payload) => {
  const product_price = calculateProductPrice(
    payload.quantity,
    payload.product.prices,
    aClientIsSelected(activeCart.client)
  );
  return [...activeCart.cart, { ...payload, product_price }];
};

// Suma `quantity` al producto que ya está en el carrito
const incrementItemAt = (cart, index, quantity) =>
  cart.map((item, i) => (i === index ? { ...item, quantity: item.quantity + quantity } : item));

// Cambia la cantidad de un producto del carrito y recalcula su precio
const setItemQuantity = (activeCart, product, quantity) => {
  const clientSelected = aClientIsSelected(activeCart.client);
  return activeCart.cart.map((item) =>
    item.id === product.id
      ? {
          ...item,
          quantity,
          product_price: calculateProductPrice(quantity, item.product.prices, clientSelected),
          available_stock: product.available_stock || item.available_stock,
        }
      : item
  );
};

const updateActiveCart = (state, updates) => ({
  ...state,
  carts: state.carts.map(c => 
    c.id === state.activeCartId 
      ? { ...c, ...updates }
      : c
  )
});

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
      return updateActiveCart(state, { client: action.payload, cart: updatedCart });
    }

    case REMOVE_CLIENT_FROM_CART: {
      const updatedCart = updateCartWithPrice(activeCart.cart, false);
      return updateActiveCart(state, { client: {}, cart: updatedCart });
    }

    case ADD_TO_CART: {
      const existingProductIndex = activeCart.cart.findIndex(
        (item) => item.id === action.payload.id
      );
      const exists = existingProductIndex !== -1;

      // Si es "agregar", no validar stock
      if (activeCart.movementType === MOVEMENT_TYPES.ADD_STOCK) {
        const updatedCart = exists
          ? incrementItemAt(activeCart.cart, existingProductIndex, action.payload.quantity)
          : appendNewItem(activeCart, action.payload);
        return updateActiveCart(state, { cart: updatedCart });
      }

      const availableStock = getAvailableStockForActiveCart(state, activeCart, action.payload);
      const isSale = activeCart.movementType === MOVEMENT_TYPES.SALE;

      if (exists) {
        const newQuantity = activeCart.cart[existingProductIndex].quantity + action.payload.quantity;
        // En ventas permitir exceder stock; en traspasos/distribuciones validar
        if (!isSale && newQuantity > availableStock) {
          return state;
        }
        return updateActiveCart(state, {
          cart: incrementItemAt(activeCart.cart, existingProductIndex, action.payload.quantity),
        });
      }

      // En ventas permitir exceder stock
      if (!isSale && action.payload.quantity > availableStock) {
        logger.warn(`Stock insuficiente. Disponible: ${availableStock}, Intentando agregar: ${action.payload.quantity}`);
        return state;
      }

      return updateActiveCart(state, { cart: appendNewItem(activeCart, action.payload) });
    }

    case REMOVE_FROM_CART: {
      const updatedCart = activeCart.cart.filter((item) => item.id !== action.payload);
      return updateActiveCart(state, { cart: updatedCart });
    }

    case CLEAN_CART: {
      return updateActiveCart(state, { cart: [], client: {} });
    }

    case UPDATE_MOVEMENT_TYPE: {
      return updateActiveCart(state, { movementType: action.payload, cart: [], client: {} });
    }

    case UPDATE_QUANTITY_IN_CART: {
      const { product, newQuantity } = action.payload;

      // Si es "agregar", no validar stock
      if (activeCart.movementType === MOVEMENT_TYPES.ADD_STOCK) {
        return updateActiveCart(state, { cart: setItemQuantity(activeCart, product, newQuantity) });
      }

      const availableStock = getAvailableStockForActiveCart(state, activeCart, product);

      // En ventas permitir exceder stock; en otros tipos, limitar
      const isSale = activeCart.movementType === MOVEMENT_TYPES.SALE;
      const clampedQuantity = (isSale || newQuantity <= availableStock)
        ? newQuantity
        : Math.max(1, availableStock);

      if (!isSale && newQuantity > availableStock) {
        logger.warn(`Stock insuficiente. Disponible: ${availableStock}, Solicitado: ${newQuantity}`);
      }

      return updateActiveCart(state, { cart: setItemQuantity(activeCart, product, clampedQuantity) });
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

      return updateActiveCart(state, { cart: updatedCart });
    }

    case COUNT_STOCK_OTHER_STORES: {
      const updatedCart = activeCart.cart.map((item) =>
        item.id === action.payload.product.id
          ? { ...item, stockOtherStores: action.payload.stock_other_storages }
          : item
      );

      return updateActiveCart(state, { cart: updatedCart });
    }

    default:
      return state;
  }
};

export default multiCartReducer;
