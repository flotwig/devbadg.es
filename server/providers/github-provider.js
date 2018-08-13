import { Strategy } from 'passport-github';

export default class GitHubProvider {
    static configure(passport, db) {
        db.Provider.create({
            'name': 'GitHub',
            'slug': 'github',
            'description': 'Earn points for your hard-earned commits and other work.'
        }).then((provider)=>
            passport.use(
                new Strategy({
                    clientID: process.env.GITHUB_CLIENT_ID,
                    clientSecret: process.env.GITHUB_CLIENT_SECRET,
                    callbackURL: process.env.BASE_URL + '/auth/github/callback',
                    passReqToCallback: true
                },
                function(req, accessToken, refreshToken, profile, done) {
                    console.log(accessToken, refreshToken, profile);
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
                                // TODO
                            } else {
                                // not logged in, log them in to this account
                                token.getUser((user) => {
                                    req.login(user)
                                    // redirect to frontpage
                                })
                            }
                        } else {
                            // this is a token we haven't seen before
                            if (!req.user) {
                                // not logged in, create account
                                db.findAvailableSlug(remoteUsername, (slug) => {
                                    db.User.create({
                                        slug, emailAddress
                                    }).then((user) => {
                                        // attach token
                                        db.Token.create({
                                            userId: user.userId,
                                            providerId: provider.id,
                                            remoteId, remoteUsername, accessToken, refreshToken
                                        })
                                        req.login(user)
                                        // TODO welcome to devbadges
                                    })
                                })
                            } else {
                                // attach token
                                db.Token.create({
                                    userId: req.user.userId,
                                    providerId: provider.id,
                                    remoteId, remoteUsername, accessToken, refreshToken
                                })
                            }
                        }
                    })
                }
            ))
        )
    }
}