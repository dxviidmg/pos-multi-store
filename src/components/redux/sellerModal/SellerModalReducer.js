import { SHOW_MODAL, HIDE_MODAL } from './SellerModalActions';

const initialState = {
  showSellerModal: false,
  seller: {}
};

const SellerModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL: {
        return {
          showSellerModal: true,
          seller: action.payload
        };
      }

      case HIDE_MODAL: {
        return {
          showSellerModal: false,
          sale: {}
        };
      }

    default:
      return state;
  }
};

export default SellerModalReducer;
