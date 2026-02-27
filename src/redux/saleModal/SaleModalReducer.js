import { SHOW_MODAL, HIDE_MODAL } from './SaleModalActions';

const initialState = {
  showSaleModal: false,
  sale: {}
};

const SaleModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL: {
        return {
          showSaleModal: true,
          sale: action.payload
        };
      }

      case HIDE_MODAL: {
        return {
          showSaleModal: false,
          sale: {}
        };
      }

    default:
      return state;
  }
};

export default SaleModalReducer;
