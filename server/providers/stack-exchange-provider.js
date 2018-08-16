import Strategy from 'passport-stack-exchange';

export default class StackExchangeProvider {
    static configure(passport, db) {
        // each site has its own API situation, create a provider for each lol
        [
            {
                slug: 'stackoverflow',
                name: 'Stack Overflow',
                description: 'Q&A for professional and enthusiast programmers'
            },
            {
                slug: 'serverfault',
                name: 'Server Fault Stack Exchange',
                description: 'Q&A for system and network administrators'
            },
            {
                slug: 'gamedev',
                name: 'Game Development Stack Exchange',
                description: 'Q&A for professional and independent game developers'
            },
            {
                slug: 'softwareengineering',
                name: 'Software Engineering Stack Exchange',
                description: 'Q&A for professionals, academic, and students working within the SDLC'
            },
            {
                slug: 'codereview',
                name: 'Code Review Stack Exchange',
                description: 'Peer programmer code reviews'
            },
            {
                slug: 'codegolf',
                name: 'Code Golf Stack Exchange',
                description: 'Programming puzzle enthusiasts and code golfers'
            },
            {
                slug: 'cs',
                name: 'Computer Science Stack Exchange',
                description: 'Q&A for students, researchers, and practitioners of computer science'
            },
            {
                slug: 'opensource',
                name: 'Open Source Stack Exchange',
                description: 'Q&A for people organizing, marketing or licensing open source projects'
            }
        ].map(site =>
            db.findOrCreateProvider(site).then((provider)=>
                passport.use(
                    site.slug, // name of strategy
                    new Strategy({
                        clientID: process.env.SE_CLIENT_ID,
                        clientSecret: process.env.SE_CLIENT_SECRET,
                        stackAppsKey: process.env.SE_KEY,
                        callbackURL: process.env.BASE_URL + '/auth/stack-exchange/callback',
                        passReqToCallback: true,
                        site: site.slug
                    },
                    function(req, accessToken, refreshToken, profile, done) {
                        console.log(accessToken, refreshToken, profile);
                        return
                        const remoteUsername = profile['_json']['login']
                        const remoteId = profile['_json']['id'].toString()
                        const emailAddress = profile['_json']['email']
                        // does a GitHub profile already exist with this remote ID?
                        db.Token.findOne({
                            where: { remoteId },
                            include: [{
                                model: db.Provider,
                                where: { slug: 'github' }
                            }]
                        }).then((token) => {
                            if (token) {
                                // found this github user already in our database
                                if (req.user) {
                                    // logged in, reject this cuz it belongs to another account
                                    done(false, req.user, { 'message': 'This GitHub account is already associated with another account.'})
                                    // TODO
                                } else {
                                    // not logged in, log them in to this account
                                    token.getUser().then(user => {
                                        done(false, user, { 'justLoggedIn': true })
                                    })
                                }
                            } else {
                                // this is a token we haven't seen before
                                const token = {
                                    providerId: provider.providerId,
                                    remoteId, remoteUsername, accessToken
                                }
                                if (!req.user) {
                                    // not logged in, create account
                                    db.findAvailableSlug(remoteUsername, (slug) => {
                                        db.User.create({
                                            slug, emailAddress
                                        }).then((user) => {
                                            // attach token
                                            token.userId = user.userId
                                            db.Token.create(token).then(()=>
                                                done(false, user, { 'justCreatedAccount': true }));
                                        })
                                    })
                                } else {
                                    // attach token
                                    token.userId = req.user.userId
                                    db.Token.create(token).then(token => {
                                        done(false, req.user, { token })
                                    })
                                }
                            }
                        })
                    }
                ))
            )
        )
    }
}