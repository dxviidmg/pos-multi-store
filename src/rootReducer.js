import { combineReducers } from 'redux';
import cartReducer from './components/redux/cart/cartReducer';
import StockModalReducer from './components/redux/stockModal/StockModalReducer';
import PaymentModalReducer from './components/redux/paymentModal/PaymentModalReducer';
import BrandModalReducer from './components/redux/brandModal/BrandModalReducer';




const rootReducer = combineReducers({
  cartReducer,
  StockModalReducer,
  PaymentModalReducer,
  BrandModalReducer
});

export default rootReducer;
