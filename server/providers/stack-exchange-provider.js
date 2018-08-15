import Strategy from 'passport-stack-exchange';

export default class StackExchangeProvider {
    static configure(passport, db) {
        db.findOrCreateProvider({
            'name': 'Stack Exchange',
            'slug': 'stack-exchange',
            'description': 'Stack Exchange is cool.'
        }).then((provider)=>
            passport.use(
                new Strategy({
                    clientID: process.env.SE_CLIENT_ID,
                    clientSecret: process.env.SE_CLIENT_SECRET,
                    callbackURL: process.env.BASE_URL + '/auth/stack-exchange/callback',
                    passReqToCallback: true
                },
                function(req, accessToken, refreshToken, profile, done) {
                    console.log(accessToken, refreshhToken, profile);
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
    }
}