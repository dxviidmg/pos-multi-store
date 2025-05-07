import { SHOW_PAYMENT_RESERVATION_MODAL, HIDE_PAYMENT_RESERVATION_MODAL } from "./PaymentReservationModalActions";

const initialState = {
  showPaymentReservationModal: false,
};

const PaymentModal2Reducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case SHOW_PAYMENT_RESERVATION_MODAL: {
      return {
        showPaymentReservationModal: true,
      };
    }

    case HIDE_PAYMENT_RESERVATION_MODAL: {
      return {
        showPaymentReservationModal: false,
      };
    }

    default:
      return state;
  }
};

export default PaymentModal2Reducer;
