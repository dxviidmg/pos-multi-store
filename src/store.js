import { createStore } from 'redux';
import rootReducer from '@/src/rootReducer';


const store = createStore(rootReducer);

export default store