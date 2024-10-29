import { combineReducers } from 'redux';
import cartReducer from './components/redux/cart/cartReducer';
import clientSelectedReducer from './components/redux/clientSelected/clientSelectedReducer';
import StockModalReducer from './components/redux/stockModal/StockModalReducer';
import PaymentModalReducer from './components/redux/paymentModal/PaymentModalReducer';

//import cartReducer from './cartReducer'; // Importamos el cartReducer

const rootReducer = combineReducers({
  cartReducer, // Lo combinamos con otros reducers
  clientSelectedReducer,
  StockModalReducer,
  PaymentModalReducer
  
  // otros reducers si los tienes
});

export default rootReducer;
