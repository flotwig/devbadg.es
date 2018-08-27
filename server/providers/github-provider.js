import { Strategy } from 'passport-github';
import { handleRemoteAuth } from './util';

export default class GitHubProvider {
    static configure(passport, db) {
        db.findOrCreateProvider({
            'name': 'GitHub',
            'slug': 'github',
            'description': 'The world\'s largest open source community.'
        }).then((provider)=>
            passport.use(
                new Strategy({
                    clientID: process.env.GITHUB_CLIENT_ID,
                    clientSecret: process.env.GITHUB_CLIENT_SECRET,
                    callbackURL: process.env.BASE_URL + '/auth/github/callback',
                    passReqToCallback: true
                },
                function(req, accessToken, refreshToken, profile, done) {
                    const token = {
                        providerId: provider.providerId,
                        remoteUsername: profile['_json']['login'],
                        remoteId: profile['_json']['id'].toString(),
                        emailAddress: profile['_json']['email'],
                        accessToken
                    }
                    handleRemoteAuth(db, req, provider, token, done)
                }
            ))
        )
    }
}