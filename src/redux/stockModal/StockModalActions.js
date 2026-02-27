export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';



export const showStockModal = (storeProduct) => ({
  type: SHOW_MODAL,
  payload: storeProduct,  
});

export const hideStockModal = () => ({
  type: HIDE_MODAL,
});