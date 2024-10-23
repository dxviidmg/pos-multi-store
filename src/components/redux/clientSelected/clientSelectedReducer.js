import { SELECT_CLIENT, REMOVE_CLIENT } from './clientSelectedActions';
const initialState = {
  client: {},
};

const clientSelectedReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_CLIENT: {
        return {
          ...state,
          client: action.payload,
        };
      }


    case REMOVE_CLIENT: {
      return {
        ...state,
        cart: {},
      };
    }

    default:
      return state;
  }
};

export default clientSelectedReducer;
