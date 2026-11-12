import { combineReducers } from "redux";
import multiCartReducer from "./redux/cart/multiCartReducer";

const rootReducer = combineReducers({
  multiCartReducer,
});

export default rootReducer;
