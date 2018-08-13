import Passport from 'passport';
import Session from 'express-session';

export default class Auth {
    constructor(db) {
        // Configure passport strategies.
        require('./providers/github-provider.js').default.configure(Passport, db);
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
        express.get('/auth/github', (req, res, next) => {
            Passport.authenticate('github', { failureRedirect: '/auth/error' })(req, res, next)
        });
        express.get('/auth/github/callback', (req, res, next) => {
            Passport.authenticate('github', { failureRedirect: '/auth/error' }, (err, user, info) => {
                console.log(err, user, info)
                if (err) {
                    req.session.flashMessage = 'Error while authenticating.'
                    if (req.user) {
                        res.redirect('/tokens')
                    } else {
                        res.redirect('/')
                    }
                } else if (info.token) {
                    token.getUrl().then(url => res.redirect(url))
                } else if (info.justCreatedAccount) {
                    req.login(user, () =>
                        res.redirect('/#welcome')
                    )
                } else if (info.justLoggedIn) {
                    req.login(user, () =>
                        res.redirect('/') // TODO: redirect to where they were before
                    )
                } else {
                    req.session.flashMessage = info.message
                    res.redirect('/tokens')
                }
            })(req, res, next)
        })
    }
}