export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';



export const showClientModal = (client) => ({
  type: SHOW_MODAL,
  payload: client,  
});

export const hideClientModal = () => ({
  type: HIDE_MODAL,
});