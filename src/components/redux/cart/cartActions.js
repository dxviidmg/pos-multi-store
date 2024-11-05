export const ADD_CLIENT_TO_CART = 'ADD_CLIENT_TO_CART';
export const REMOVE_CLIENT_FROM_CART = 'REMOVE_CLIENT_FROM_CART';

export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const CLEAN_CART = 'CLEAN_CART';


export const addClientToCart = (client) => ({
  type: ADD_CLIENT_TO_CART,
  payload: client,
});

export const removeClientfromCart = (client) => ({
  type: REMOVE_CLIENT_FROM_CART,
  payload: client,
});

export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
});

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
});

export const cleanCart = () => ({
  type: CLEAN_CART,
});