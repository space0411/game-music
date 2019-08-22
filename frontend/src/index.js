import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'mobx-react';
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'typeface-roboto';

import LoginScreen from './components/LoginScreen';
import App from './App';

import SessionStore from './stores/SessionStore';
import ScreenStore from './stores/ScreenStore';

const stores = {
    SessionStore,
    ScreenStore
};

const hist = createBrowserHistory();

// For easier debugging
window._____APP_STATE_____ = stores;

ReactDOM.render((
    <Provider {...stores}>
        <Router history={hist}>
            <Switch>
                <Route path="/admin" component={App} />
                <Route path="/login" component={LoginScreen} />
                <Redirect from="/" to="/admin/dashboard" />
            </Switch>
        </Router>
    </Provider>), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
