export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';



export const showBrandModal = (brand) => ({
  type: SHOW_MODAL,
  payload: brand,  
});

export const hideBrandModal = () => ({
  type: HIDE_MODAL,
});