import { SHOW_MODAL, HIDE_MODAL } from './LogsModalActions';

const initialState = {
  showSaleModal: false,
  storeProduct: {},
  adjustStock: false
};

const LogsModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL: {
        return {
          showLogsModal: true,
          storeProduct: action.payload.storeProduct,
          adjustStock: action.payload.adjustStock
        };
      }

      case HIDE_MODAL: {
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
