import { createStore } from 'redux';
//import cartReducer from './cartReducer';
import rootReducer from './rootReducer';


const store = createStore(rootReducer);

export default store