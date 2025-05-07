import { SHOW_PAYMENT_RESERVATION_MODAL, HIDE_PAYMENT_RESERVATION_MODAL } from "./PaymentReservationModalActions";

const initialState = {
  showPaymentReservationModal: false,
  reservation: {}

};

const PaymentModal2Reducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case SHOW_PAYMENT_RESERVATION_MODAL: {
      return {
        showPaymentReservationModal: true,
        reservation: action.payload
      };
    }

    case HIDE_PAYMENT_RESERVATION_MODAL: {
      return {
        showPaymentReservationModal: false,
        reservation: {}
      };
    }

    default:
      return state;
  }
};

export default PaymentModal2Reducer;
