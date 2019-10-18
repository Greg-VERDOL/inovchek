import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/AppContainer';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import AuthState from './context/auth/AuthState';
import setAuthToken from './utils/setAuthToken';
import './App.css';
import store from './store';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

ReactDOM.render(
  <AuthState>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </AuthState>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
