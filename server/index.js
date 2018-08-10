/**
 * Entrypoint for server. Loads up babel, which will allow us to import the ES6
 * code used on the frontend and in the rest of the server code.
 * 
 * Starts the Server.
 */

require('babel-register')({
    presets: ['env', 'react']
});
require('ignore-styles').default(['.css']);

const {default: Server} = require('./server.js');

const server = new Server();
server.start();