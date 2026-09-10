import { combineReducers } from "redux";
import cartReducer from "@/src/redux/cart/cartReducer";
import multiCartReducer from "@/src/redux/cart/multiCartReducer";

const rootReducer = combineReducers({
  cartReducer,
  multiCartReducer,
});

export default rootReducer;
