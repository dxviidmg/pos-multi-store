import { SHOW_MODAL, HIDE_MODAL } from './BrandModalActions';

const initialState = {
  showBrandModal: false,
  brand: {}
};

const BrandModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL: {
        return {
          showBrandModal: true,
          brand: action.payload
        };
      }

      case HIDE_MODAL: {
        return {
          showBrandModal: false,
          brand: {}
        };
      }

    default:
      return state;
  }
};

export default BrandModalReducer;
