import { combineReducers } from 'redux';
import cartReducer from './components/redux/cart/cartReducer';
import StockModalReducer from './components/redux/stockModal/StockModalReducer';
import PaymentModalReducer from './components/redux/paymentModal/PaymentModalReducer';
import BrandModalReducer from './components/redux/brandModal/BrandModalReducer';
import ProductModalReducer from './components/redux/productModal/ProductModalReducer';




const rootReducer = combineReducers({
  cartReducer,
  StockModalReducer,
  PaymentModalReducer,
  BrandModalReducer,
  ProductModalReducer
});

export default rootReducer;
