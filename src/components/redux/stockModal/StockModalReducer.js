import { SHOW_MODAL, HIDE_MODAL } from './StockModalActions';

const initialState = {
  showStockModal: false,
  storeProduct: {}
};

const StockModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL: {
        return {
          showStockModal: true,
          storeProduct: action.payload
        };
      }

      case HIDE_MODAL: {
        return {
          showStockModal: false,
          storeProduct: {}
        };
      }

    default:
      return state;
  }
};

export default StockModalReducer;
