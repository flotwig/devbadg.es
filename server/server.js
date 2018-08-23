import Express from 'express';
import addReactToServer from './react-controller.js';

export default class Server {
    constructor(auth, db) {
        this.auth = auth
        this.db = db
        this.express = new Express();
        this.express.use((req, res, next) => {
            if (req.get('X-Forwarded-Proto') === 'http')
                res.redirect(301, `https://${req.hostname}${req.originalUrl}`)
            else next()
        })
        this.auth.addAuthToServer(this.express)
        this.port = process.env.PORT;
    }
    start() {
        this.addRoutes();
        addReactToServer(this.express, this.db)
        this.express.listen(this.port, ()=>{
            console.log('Listening on port ' + this.port)
        });
    }
    addRoutes() {
        this.addApiRoutes();
    }
    addApiRoutes() {

    }
}