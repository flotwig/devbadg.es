/**
 * Entrypoint for server. 
 */

// Load configuration.
const fs = require('fs');
if (!fs.existsSync('../.env')) {
    console.error('Create a .env file with the variables from .env.ex filled out in this project\'s root directory.')
    process.exit()
}
const path = require('path');
require('dotenv').config({ path: '../.env' })

// Loads up Babel, which will allow us to import the ES6
// code used on the frontend and in the rest of the server code.
require('babel-register')({
    presets: ['env', 'react']
});
require('ignore-styles').default(['.css']);

// Initialize database.
const {default: Db} = require('./db.js');
const db = new Db();

// Configure passport strategies.
const passport = require('passport');
require('./providers/github-provider.js').default.configure(passport, db);

// Start the server proper.
const {default: Server} = require('./server.js');

const server = new Server(passport, db);
server.start();