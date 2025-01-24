export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';



export const showLogsModal = (storeProduct) => ({
  type: SHOW_MODAL,
  payload: storeProduct,  
});

export const hideLogsModal = () => ({
  type: HIDE_MODAL,
});