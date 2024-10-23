import { combineReducers } from 'redux';
import cartReducer from './components/redux/cart/cartReducer';
//import cartReducer from './cartReducer'; // Importamos el cartReducer

const rootReducer = combineReducers({
  cartReducer, // Lo combinamos con otros reducers
  // otros reducers si los tienes
});

export default rootReducer;
