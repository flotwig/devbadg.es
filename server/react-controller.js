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

/**
 * Add the necessary React middleware and routes to an Express instance.
 * @param {Express} express Express instance to attach to.
 * @param {Db} db Database instance to use.
 */
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

/**
 * React middleware. Creates the Redux Store using the known reducers. Because req.store is set,
 * the corresponding API routes will fill in the store instead of returning JSON. // TODO: <-- implement this, this is a good way of doing it!!!
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function ReactMiddleware(req, res, next) {
    req.store = createStore(combinedReducer)
    if (req.user) {
        req.store.dispatch(setUser(req.user))
    }
    next()
}

/**
 * Controller to render the React page to HTML using the preloaded state.
 * The HTML and preloaded state will be hydrated by React on the client-side on load.
 * By rendering it server-side first, we save time on initial load. We also improve SEO.
 * @param {*} req 
 * @param {*} res 
 */
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