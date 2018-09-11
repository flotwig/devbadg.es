import Express from 'express';
import addReactToServer from './react-controller.js';

/**
 * Web server component.
 */
export default class Server {
    constructor(auth, db) {
        this.auth = auth
        this.db = db
        this.express = new Express();
        this.port = process.env.PORT;
    }
    start() {
        this.express.use(this.useHttps)
        this.auth.addAuthToServer(this.express)
        addReactToServer(this.express, this.db)
        this.express.listen(this.port, ()=>{
            console.log('Listening on port ' + this.port)
        });
    }
    /**
     * Middleware to force HTTPS on the live GAE instance.
     */
    useHttps = (req, res, next) => {
        if (req.get('X-Forwarded-Proto') === 'http')
            res.redirect(301, `https://${req.hostname}${req.originalUrl}`)
        else next()
    }
}