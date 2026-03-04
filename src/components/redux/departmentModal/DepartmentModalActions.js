export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';



export const showDepartmentModal = (department) => ({
  type: SHOW_MODAL,
  payload: department,  
});

export const hideDepartmentModal = () => ({
  type: HIDE_MODAL,
});