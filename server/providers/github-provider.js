import { Strategy } from 'passport-github';

export default class GitHubProvider {
    static configure(passport, db) {
        db.findOrCreateProvider({
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
                                done(false, req.user, { 'message': 'This GitHub account is already associated with another account.'})
                                // TODO
                            } else {
                                // not logged in, log them in to this account
                                token.getUser((user) => {
                                    done(false, user, { 'justLoggedIn': true })
                                })
                            }
                        } else {
                            // this is a token we haven't seen before
                            const token = {
                                providerId: provider.providerId,
                                remoteId, remoteUsername, accessToken, refreshToken
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
    }
}