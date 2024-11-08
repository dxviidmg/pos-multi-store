import { combineReducers } from 'redux';
import cartReducer from './components/redux/cart/cartReducer';
import StockModalReducer from './components/redux/stockModal/StockModalReducer';
import PaymentModalReducer from './components/redux/paymentModal/PaymentModalReducer';

const rootReducer = combineReducers({
  cartReducer,
  StockModalReducer,
  PaymentModalReducer
});

export default rootReducer;
