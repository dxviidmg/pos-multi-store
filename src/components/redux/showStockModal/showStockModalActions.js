export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';



export const showStockModal = (product) => ({
  type: SHOW_MODAL,
  payload: product,  
});

export const hideStockModal = () => ({
  type: HIDE_MODAL,
});