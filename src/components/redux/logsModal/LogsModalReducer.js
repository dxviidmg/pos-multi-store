import { SHOW_LOGS_MODAL, HIDE_LOGS_MODAL } from './LogsModalActions';

const initialState = {
  showSaleModal: false,
  storeProduct: {},
  adjustStock: false
};

const LogsModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_LOGS_MODAL: {
        return {
          showLogsModal: true,
          storeProduct: action.payload.storeProduct,
          adjustStock: action.payload.adjustStock
        };
      }

      case HIDE_LOGS_MODAL: {
        return {
          showLogsModal: false,
          storeProduct: {}
        };
      }

    default:
      return state;
  }
};

export default LogsModalReducer;
