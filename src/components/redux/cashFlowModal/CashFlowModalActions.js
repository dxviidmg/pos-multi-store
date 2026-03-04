export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';



export const showCashFlowModal = (cashFlow) => ({
  type: SHOW_MODAL,
  payload: cashFlow,  
});

export const hideCashFlowModal = () => ({
  type: HIDE_MODAL,
});