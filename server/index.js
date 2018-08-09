require('babel-register');
const {default: Server} = require('./server.js');

const server = new Server();
server.start();