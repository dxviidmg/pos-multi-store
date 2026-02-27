export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';



export const showSaleModal = (sale) => ({
  type: SHOW_MODAL,
  payload: sale,  
});

export const hideSaleModal = () => ({
  type: HIDE_MODAL,
});