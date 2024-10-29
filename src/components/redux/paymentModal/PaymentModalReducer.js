import { SHOW_MODAL2, HIDE_MODAL2 } from './PaymentModalActions';

const initialState = {
  showPaymentModal: false,
  product: {}
};

const PaymentModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL2: {
        return {
          showPaymentModal: true,
          product: action.payload
        };
      }

      case HIDE_MODAL2: {
        return {
          showStockModal: false,
          product: {}
        };
      }

    default:
      return state;
  }
};

export default PaymentModalReducer;
