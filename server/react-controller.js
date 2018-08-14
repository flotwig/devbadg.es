import React from '../node_modules/react';
import { renderToString } from '../node_modules/react-dom/server';
import { StaticRouter } from '../node_modules/react-router-dom';
import App from '../src/App.js';
import fs from 'fs';
import { createStore } from '../node_modules/redux';
import { Provider } from '../node_modules/react-redux';
import combinedReducer from '../src/state/reducers.js'
import { setUser, receiveTokens } from '../src/state/actions.js'
import Express from 'express';

var template = fs.readFileSync(`${__dirname}/../build/index.html`, 'utf8');

export default function addReactToServer(express, db) {
    express.use(Express.static(`${__dirname}/../build`, { index: false }))
    express.use(ReactMiddleware)
    express.use('/tokens', (req, res, next) => {
        if (!req.user) return next()
        db.Token.findAll({
            where: { userId: req.user.userId },
            include: [ { model: db.Provider } ]
        }).then(tokens => {
            req.store.dispatch(receiveTokens(tokens))
            next()
        })
    })
    express.use(ReactController);
}

function ReactMiddleware(req, res, next) {
    req.store = createStore(combinedReducer)
    if (req.user) {
        req.store.dispatch(setUser(req.user))
    }
    next()
}

function ReactController(req, res) {
    if (process.env.NODE_ENV === 'development') {
        template = fs.readFileSync(`${__dirname}/../build/index.html`, 'utf8')
    }
    const context = {}
    const markup = renderToString(
        <Provider store={req.store}>
            <StaticRouter
                location={req.url}
                context={context}
            >
                <App/>
            </StaticRouter>
        </Provider>
    );

    const preloadedState = req.store.getState();

    if (context.url) {
        res.redirect(301, context.url)
    } else {
        const rendered = template.replace('<div id="root"></div>', '<div id="root">'+markup+'</div>')
            .replace('%PRELOADED_STATE%', JSON.stringify(preloadedState).replace(/</g, '\\u003c'));
        res.status(context.status || 200).send(rendered)
    }
    res.end();
}