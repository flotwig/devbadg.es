/**
 * Entrypoint for server. 
 */

// Load configuration.
const fs = require('fs');
if (!fs.existsSync('../.env') && false) {
    console.error('Create a .env file with the variables from .env.ex filled out in this project\'s root directory.')
    process.exit()
}
const path = require('path');
require('dotenv').config({ path: `${__dirname}/../.env` })

// Set up proxy configuration.
if (process.env.HTTP_PROXY) {
    const globalTunnel = require('global-tunnel-ng');
    const url = require('url');
    const proxy = url.parse(process.env.HTTP_PROXY);
    globalTunnel.initialize({
        host: proxy.hostname,
        port: parseInt(proxy.port, 10),
        tunnel: 'both',
        protocol: proxy.protocol
    })
}

// Loads up Babel, which will allow us to import the ES6
// code used on the frontend and in the rest of the server code.
require('babel-register')({
    presets: ['env', 'react', 'stage-0']
});
require('ignore-styles').default(['.css']);

// Initialize database.
const {default: Db} = require('./db.js');
const db = new Db();

db.sequelize.sync({
    //force: true
}).then(() => {
    // Configure auth.
    const {default: Auth} = require('./auth.js');
    const auth = new Auth(db);

    // Start the server proper.
    const {default: Server} = require('./server.js');

    const server = new Server(auth, db);
    server.start();
})