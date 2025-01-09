import { SHOW_MODAL, HIDE_MODAL } from './ClientModalActions';

const initialState = {
  showClientModal: false,
  client: {}
};

const ClientModalReducer = (state = initialState, action) => {
  console.log('showClientModal')
  switch (action.type) {
    case SHOW_MODAL: {
        return {
          showClientModal: true,
          client: action.payload
        };
      }

      case HIDE_MODAL: {
        return {
          showClientModal: false,
          client: {}
        };
      }

    default:
      return state;
  }
};

export default ClientModalReducer;
