export const SHOW_PAYMENT_RESERVATION_MODAL = 'SHOW_PAYMENT_RESERVATION_MODAL';
export const HIDE_PAYMENT_RESERVATION_MODAL = 'HIDE_PAYMENT_RESERVATION_MODAL';



export const showPaymentReservationModal = () => ({
  type: SHOW_PAYMENT_RESERVATION_MODAL,
});

export const hidePaymentReservationModal = () => ({
  type: HIDE_PAYMENT_RESERVATION_MODAL,
});