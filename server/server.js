import Express from 'express';
import ReactController from './react-controller.js';

export default class Server {
    constructor() {
        this.express = new Express()
        this.port = 8091
    }
    start() {
        this.express.listen(this.port, ()=>{
            console.log('Listening on http://localhost:' + this.port)
        })
    }
    addRoutes() {
        this.express.Router().get('/', ReactController)
    }
}