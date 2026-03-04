export const SHOW_LOGS_MODAL = 'SHOW_LOGS_MODAL';
export const HIDE_LOGS_MODAL = 'HIDE_LOGS_MODAL';



export const showLogsModal = (storeProduct, adjustStock) => ({
  type: SHOW_LOGS_MODAL,
  payload: { storeProduct, adjustStock }
});

export const hideLogsModal = () => ({
  type: HIDE_LOGS_MODAL
});