import { UPDATE_MOVEMENT_TYPE } from './movementTypeActions';

const initialState = {
  movementType: "venta",
};

const movementTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MOVEMENT_TYPE: {
        return {
          movementType: action.payload
        };
      }

    default:
      return state;
  }
};

export default movementTypeReducer;
