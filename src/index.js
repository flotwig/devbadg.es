import React from 'react';
import { hydrate } from 'react-dom';
import './index.css';
import App from './App';
import AppRouter from './AppRouter';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import combinedReducer from './state/reducers.js';


const preloadedState = window.__PRELOADED_STATE__

delete window.__PRELOADED_STATE__

const store = createStore(combinedReducer, preloadedState)

hydrate(
    (
        <Provider store={store}>
            <AppRouter>
                <App />
            </AppRouter>
        </Provider>
    ),
    document.getElementById('root')
);
