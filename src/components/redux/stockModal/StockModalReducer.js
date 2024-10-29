import { SHOW_MODAL, HIDE_MODAL } from './StockModalActions';

const initialState = {
  showStockModal: false,
  product: {}
};

const StockModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL: {
        return {
          showStockModal: true,
          product: action.payload
        };
      }

      case HIDE_MODAL: {
        return {
          showStockModal: false,
          product: {}
        };
      }

    default:
      return state;
  }
};

export default StockModalReducer;
