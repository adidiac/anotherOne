import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {userRedux} from './Redux/userRedux';
import {Provider} from 'react-redux';
import {createStore,combineReducers} from 'redux';

const reducer=combineReducers({
    userRedux
})

const store=createStore(reducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


