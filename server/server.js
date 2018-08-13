import Express from 'express';
import ReactController from './react-controller.js';
import Session from 'express-session';

export default class Server {
    constructor(passport, db) {
        this.passport = passport
        this.db = db
        this.express = new Express();
        this.express.use(new Session({
            secret: 'hello-world'
        }));
        this.express.use(passport.initialize());
        this.express.use(passport.session())
        this.port = process.env.PORT;
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
        this.express.get('/auth/github', this.passport.authorize('github', { failureRedirect: '/auth/error' }, (req, res) => {
            console.log(req);
        }));
        this.express.get('/auth/github/callback', this.passport.authorize('github', { failureRedirect: '/auth/error' }, (req, res) => {
            console.log(req);
        }))
    }
}