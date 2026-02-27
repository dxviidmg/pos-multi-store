export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';



export const showSellerModal = (sale) => ({
  type: SHOW_MODAL,
  payload: sale,  
});

export const hideSellerModal = () => ({
  type: HIDE_MODAL,
});