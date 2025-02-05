import { SHOW_MODAL, HIDE_MODAL } from './ProductModalActions';

const initialState = {
  showProductModal: false,
  product: {}
};

const ProductModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL: {
        return {
          showProductModal: true,
          product: action.payload
        };
      }

      case HIDE_MODAL: {
        return {
          showProductModal: false,
          product: {}
        };
      }

    default:
      return state;
  }
};

export default ProductModalReducer;
