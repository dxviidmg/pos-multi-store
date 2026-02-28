import { combineReducers } from "redux";
import cartReducer from "./redux/cart/cartReducer";
import multiCartReducer from "./redux/cart/multiCartReducer";

const rootReducer = combineReducers({
  cartReducer,
  multiCartReducer,
});

export default rootReducer;
