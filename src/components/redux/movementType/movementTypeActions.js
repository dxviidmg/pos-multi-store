export const UPDATE_MOVEMENT_TYPE = 'UPDATE_MOVEMENT_TYPE';


export const updateMovement = (movementType) => ({
  type: UPDATE_MOVEMENT_TYPE,
  payload: movementType,  
});