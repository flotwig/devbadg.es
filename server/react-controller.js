import React from '../node_modules/react';
import { renderToString } from '../node_modules/react-dom/server';
import { StaticRouter } from '../node_modules/react-router-dom';
import App from '../src/App.js';
import fs from 'fs';

const template = fs.readFileSync('../build/index.html', 'utf8');

export default function ReactController(req, res) {
    const context = {}
    const api = {}

    const markup = renderToString(
            <StaticRouter
                location={req.url}
                context={context}
            >
                <App/>
            </StaticRouter>
    );

    const rendered = template.replace('<div id="root"></div>', '<div id="root">'+markup+'</div>');

    res.send(rendered)
}