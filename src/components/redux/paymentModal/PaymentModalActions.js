export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';



export const showPaymentModal = () => ({
  type: SHOW_MODAL,
//  payload: product,  
});

export const hidePaymentModal = () => ({
  type: HIDE_MODAL,
});