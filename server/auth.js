import Passport from 'passport';
import Session from 'express-session';

export default class Auth {
    constructor(db) {
        // Configure passport strategies.
        require('./providers/github-provider.js').default.configure(Passport, db);
        require('./providers/stack-exchange-provider.js').default.configure(Passport, db);
        Passport.serializeUser(function(user, done) {
            done(null, user.get())
        })
        Passport.deserializeUser(function(user, done) {
            done(null, db.User.build(user))
        })
    }
    addAuthToServer(express) {
        this.addAuthMiddleware(express)
        this.addAuthRoutes(express)
    }
    addAuthMiddleware(express) {
        express.use(new Session({
            secret: process.env.SESSION_SECRET,
            secure: !!process.env.HTTPS
        }));
        express.use(Passport.initialize());
        express.use(Passport.session())
    }
    addAuthRoutes(express) {
        express.get('/auth/:slug(github|stack-exchange)', (req, res, next) => {
            Passport.authenticate(req.params.slug, { failureRedirect: '/auth/error' })(req, res, next)
        });
        express.get('/auth/:slug(github|stack-exchange)/callback', (req, res, next) => {
            // Route when a code is returned from the OAuth flow and we can retrieve a token.
            Passport.authenticate(req.params.slug, { failureRedirect: '/auth/error' }, (err, user, info) => {
                // This callback is called by the individual provider's passport.use callback
                console.log(err, user, info)
                if (err) {
                    req.session.flashMessage = 'Error while authenticating.'
                    if (req.user) {
                        res.redirect('/tokens')
                    } else {
                        res.redirect('/')
                    }
                    res.end()
                } else if (info.token) {
                    token.getUrl().then(url => {
                        res.redirect(url)
                        res.end()
                    })
                } else if (info.justCreatedAccount || info.justLoggedIn) {
                    req.login(user, () => {
                        res.redirect('/') // TODO: redirect to where they were before
                        res.end()
                    })
                } else {
                    req.session.flashMessage = info.message
                    res.redirect('/tokens')
                    res.end()
                }
            })(req, res, next)
        })
    }
}