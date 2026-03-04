import { SHOW_MODAL, HIDE_MODAL } from './CashFlowModalActions';

const initialState = {
  showCashFlowModal: false,
  cashFlow: {}
};

const CashFlowModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL: {
        return {
          showCashFlowModal: true,
          cashFlow: action.payload
        };
      }

      case HIDE_MODAL: {
        return {
          showCashFlowModal: false,
          cashFlow: {}
        };
      }

    default:
      return state;
  }
};

export default CashFlowModalReducer;
