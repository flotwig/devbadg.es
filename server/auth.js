import Passport from 'passport';
import Session from 'express-session';
import url from 'url';

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
        const hostParts = url.parse(process.env.BASE_URL).host.split('.')
        var cookieDomain;
        if(hostParts.length === 1)
            cookieDomain = hostParts[0]
        else
            cookieDomain = hostParts[hostParts.length - 2] + '.' + hostParts[hostParts.length - 1]
        express.use(new Session({
            secret: process.env.SESSION_SECRET,
            secure: !!process.env.HTTPS,
            cookie: {
                domain: cookieDomain
            }
        }));
        express.use(Passport.initialize());
        express.use(Passport.session())
    }
    addAuthRoutes(express) {
        express.get('/auth/:slug', (req, res, next) => {
            const slug = req.params.slug;
            this.db.Provider.findOne({
                where: { slug }
            }).then(provider => {
                if (provider) Passport.authenticate(provider.slug, { failureRedirect: '/auth/error' })(req, res, next)
                else next()
            })
        });
        express.get('/auth/:slug/callback', (req, res, next) => {
            // Route when a code is returned from the OAuth flow and we can retrieve a token.
            const slug = req.params.slug;
            this.db.Provider.findOne({
                where: { slug  }
            }).then(provider => {
                if (provider)
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
                else next()
            })
        })
    }
}