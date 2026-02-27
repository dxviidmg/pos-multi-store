import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  client: {},
  movementType: "venta"
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
    product_price: calculateProductPrice(
      item.quantity,
      item.product,
      aClientIsSelected(clientSelected)
    ),
  }));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addClientToCart: (state, action) => {
      state.client = action.payload;
      state.cart = updateCartWithPrice(state.cart, action.payload);
    },
    removeClientfromCart: (state) => {
      state.client = {};
      state.cart = updateCartWithPrice(state.cart, {});
    },
    addToCart: (state, action) => {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.product_price = calculateProductPrice(
          existingItem.quantity,
          existingItem.product,
          aClientIsSelected(state.client)
        );
      } else {
        state.cart.push({
          ...action.payload,
          quantity: 1,
          product_price: calculateProductPrice(1, action.payload.product, aClientIsSelected(state.client)),
        });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },
    cleanCart: (state) => {
      state.cart = [];
    },
    updateMovementType: (state, action) => {
      state.movementType = action.payload;
    },
    updateQuantityInCart: (state, action) => {
      const { product, quantity } = action.payload;
      const item = state.cart.find(i => i.id === product.id);
      if (item) {
        item.quantity = quantity;
        item.product_price = calculateProductPrice(
          quantity,
          item.product,
          aClientIsSelected(state.client)
        );
      }
    },
    changePrice: (state, action) => {
      const item = state.cart.find(i => i.id === action.payload.id);
      if (item) {
        item.product_price = changeProductPrice(item.product_price, item.product);
      }
    },
    countStockOtherStores: (state, action) => {
      const { id, count } = action.payload;
      const item = state.cart.find(i => i.id === id);
      if (item) {
        item.count_stock_other_stores = count;
      }
    },
  },
});

export const {
  addClientToCart,
  removeClientfromCart,
  addToCart,
  removeFromCart,
  cleanCart,
  updateMovementType,
  updateQuantityInCart,
  changePrice,
  countStockOtherStores,
} = cartSlice.actions;

export default cartSlice.reducer;
