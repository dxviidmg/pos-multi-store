import { SHOW_MODAL, HIDE_MODAL } from './PaymentModalActions';

const initialState = {
  showPaymentModal: false,
  product: {}
};

const PaymentModalReducer = (state = initialState, action) => {
  console.log('llegue xxx que onda')
  switch (action.type) {
    case SHOW_MODAL: {
        return {
          showPaymentModal: true,
          product: action.payload
        };
      }

      case HIDE_MODAL: {
        console.log('llegue 2')
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
