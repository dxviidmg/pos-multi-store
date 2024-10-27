export const SELECT_CLIENT = 'SELECT_CLIENT';
export const REMOVE_CLIENT = 'REMOVE_CLIENT';

export const selectClient = (client) => ({
  type: SELECT_CLIENT,
  payload: client,
});

export const removeClient = () => ({
  type: REMOVE_CLIENT,
});