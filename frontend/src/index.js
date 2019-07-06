import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'mobx-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'typeface-roboto';

import SessionStore from './stores/SessionStore';
import ScreenStore from './stores/ScreenStore';


const stores = {
    SessionStore,
    ScreenStore
};

// For easier debugging
window._____APP_STATE_____ = stores;

ReactDOM.render((
    <Provider {...stores}>
        <App />
    </Provider>), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
