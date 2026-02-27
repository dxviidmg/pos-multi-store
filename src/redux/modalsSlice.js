import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brand: { show: false, data: null },
  product: { show: false, data: null },
  client: { show: false, data: null },
  sale: { show: false, data: null },
  stock: { show: false, data: null },
  payment: { show: false, data: null },
  paymentReservation: { show: false, data: null },
  logs: { show: false, data: null },
  cashFlow: { show: false, data: null },
  seller: { show: false, data: null },
  department: { show: false, data: null },
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    showModal: (state, action) => {
      const { modal, data } = action.payload;
      state[modal] = { show: true, data: data || null };
    },
    hideModal: (state, action) => {
      const modal = action.payload;
      state[modal] = { show: false, data: null };
    },
  },
});

export const { showModal, hideModal } = modalsSlice.actions;
export default modalsSlice.reducer;
