import { SHOW_MODAL, HIDE_MODAL } from './ProductModalActions';

const initialState = {
  showBrandModal: false,
  product: {}
};

const ProductModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL: {
        return {
          showBrandModal: true,
          product: action.payload
        };
      }

      case HIDE_MODAL: {
        return {
          showBrandModal: false,
          product: {}
        };
      }

    default:
      return state;
  }
};

export default ProductModalReducer;
