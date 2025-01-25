export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';



export const showLogsModal = (storeProduct, adjustStock) => ({
  type: SHOW_MODAL,
  payload: {
    storeProduct,
    adjustStock,
  },
});
export const hideLogsModal = () => ({
  type: HIDE_MODAL,
});