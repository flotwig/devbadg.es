import React from '../node_modules/react';
import { renderToString } from '../node_modules/react-dom/server';
import { StaticRouter } from '../node_modules/react-router-dom';
import { App } from '../src/App.js';
import fs from 'fs';

const template = fs.readFileSync('../build/index.html', 'utf8');

export default function ReactController(req, res) {
    const markup = renderToString(<App/>);
    const rendered = template.replace('<div id="root"></div>', markup);

    res.send(rendered)
}