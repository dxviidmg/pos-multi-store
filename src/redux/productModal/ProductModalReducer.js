import { SHOW_MODAL, HIDE_MODAL, SHOW_MODAL2 } from './ProductModalActions';

const initialState = {
  showProductModal: false,
  product: {},
  showStoreProducts: false
};

const ProductModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL: {
        return {
          showProductModal: true,
          product: action.payload,
          showStoreProducts: false
        };
      }

      case SHOW_MODAL2: {
        return {
          showProductModal: true,
          product: action.payload,
          showStoreProducts: true
        };
      }

      case HIDE_MODAL: {
        return {
          showProductModal: false,
          product: {},
          showStoreProducts: false
        };
      }

    default:
      return state;
  }
};

export default ProductModalReducer;
