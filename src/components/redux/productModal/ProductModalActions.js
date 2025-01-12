export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';



export const showProductModal = (product) => ({
  type: SHOW_MODAL,
  payload: product,  
});

export const hideProductModal = () => ({
  type: HIDE_MODAL,
});