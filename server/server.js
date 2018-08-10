import Express from 'express';
import ReactController from './react-controller.js';

export default class Server {
    constructor() {
        this.express = new Express();
        this.port = 8091;
    }
    start() {
        this.addRoutes();
        this.express.listen(this.port, ()=>{
            console.log('Listening on http://localhost:' + this.port)
        });
    }
    addRoutes() {
        this.addReactRoutes();
        this.addApiRoutes();
        this.addAuthRoutes();
    }
    addReactRoutes() {
        // routes responsible for the react frontend
        this.express.get('/', ReactController);
        this.express.use(Express.static('../build'))
    }
    addApiRoutes() {

    }
    addAuthRoutes() {

    }
}