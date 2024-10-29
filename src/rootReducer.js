import { combineReducers } from 'redux';
import cartReducer from './components/redux/cart/cartReducer';
import clientSelectedReducer from './components/redux/clientSelected/clientSelectedReducer';
import StockModalReducer from './components/redux/StockModal/StockModalReducer';

//import cartReducer from './cartReducer'; // Importamos el cartReducer

const rootReducer = combineReducers({
  cartReducer, // Lo combinamos con otros reducers
  clientSelectedReducer,
  StockModalReducer
  // otros reducers si los tienes
});

export default rootReducer;
