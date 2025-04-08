export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const SHOW_MODAL2 = 'SHOW_MODAL2';

export const showProductModal = (product) => ({
  type: SHOW_MODAL,
  payload: product,  
});

export const hideProductModal = () => ({
  type: HIDE_MODAL,
});

export const showProductModal2 = (product) => ({
  type: SHOW_MODAL2,
  payload: product,  
});