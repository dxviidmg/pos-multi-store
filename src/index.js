import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa desde 'react-dom/client' en lugar de 'react-dom'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './rootReducer'; // Asegúrate de que estés importando tu rootReducer
import App from './App';

// Crea tu store de Redux
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// Utiliza createRoot en lugar de ReactDOM.render
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // Crea el root de React

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
