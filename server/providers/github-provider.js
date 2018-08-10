import { Strategy } from 'passport-github';

export default class GitHubProvider {
    static configure(passport, db) {
        passport.use(
            new Strategy({
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: process.env.BASE_URL + '/auth/github/callback',
                passReqToCallback: true
            },
            function(req, accessToken, refreshToken, profile, cb) {
                console.log(accessToken, refreshToken, profile);
                if (req.user) {
                    // logged in, associate this to the account
                } else {
                    // create new account or reject if already in use
                }
            }
        ));
    }
}