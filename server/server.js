import Express from 'express';
import ReactController from './react-controller.js';

export default class Server {
    constructor(passport, db) {
        this.passport = passport
        this.db = db
        this.express = new Express();
        this.port = process.env.port;
    }
    start() {
        this.addRoutes();
        this.express.listen(this.port, ()=>{
            console.log('Listening on port ' + this.port)
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
        this.express.get('/auth/github', this.passport.authorize('github', { failureRedirect: '/auth/error' }));
        this.express.get('/auth/github/callback', this.passport.authorize('github', { failureRedirect: '/auth/error' }, (req, res) => {
            console.log(req);
        }))
    }
}