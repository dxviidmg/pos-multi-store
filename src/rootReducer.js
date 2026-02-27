import { combineReducers } from "redux";
import cartReducer from "./redux/cart/cartReducer";
import StockModalReducer from "./redux/stockModal/StockModalReducer";
import PaymentModalReducer from "./redux/paymentModal/PaymentModalReducer";
import BrandModalReducer from "./redux/brandModal/BrandModalReducer";
import ProductModalReducer from "./redux/productModal/ProductModalReducer";
import ClientModalReducer from "./redux/clientModal/ClientModalReducer";
import SaleModalReducer from "./redux/saleModal/SaleModalReducer";
import LogsModalReducer from "./redux/logsModal/LogsModalReducer";
import CashFlowModalReducer from "./redux/cashFlowModal/CashFlowModalReducer";
import SellerModalReducer from "./redux/sellerModal/SellerModalReducer";
import DepartmentModalReducer from "./redux/departmentModal/DepartmentModalReducer";
import PaymentModal2Reducer from "./redux/paymentReservationModal/PaymentReservationModalReducer";

const rootReducer = combineReducers({
  cartReducer,
  StockModalReducer,
  PaymentModalReducer,
  BrandModalReducer,
  ProductModalReducer,
  ClientModalReducer,
  SaleModalReducer,
  LogsModalReducer,
  CashFlowModalReducer,
  SellerModalReducer,
  DepartmentModalReducer,
  PaymentModal2Reducer
});

export default rootReducer;
