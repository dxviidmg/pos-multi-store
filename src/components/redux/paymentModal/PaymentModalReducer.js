import { SHOW_MODAL2, HIDE_MODAL2 } from "./PaymentModalActions";

const initialState = {
  showPaymentModal: false,
};

const PaymentModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL2: {
      return {
        showPaymentModal: true,
      };
    }

    case HIDE_MODAL2: {
      return {
        showPaymentModal: false,
      };
    }

    default:
      return state;
  }
};

export default PaymentModalReducer;
