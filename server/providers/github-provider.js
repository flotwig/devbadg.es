import { Strategy } from 'passport-github';
import { handleRemoteAuth } from './util';

/**
 * Provider for the GitHub source code website.
 */
export default class GitHubProvider {
    /**
     * Configure the provider.
     * @param {Passport} passport 
     * @param {Db} db 
     */
    static configure(passport, db) {
        db.Statistic.load({
            'commits': 'Commits',
            'acceptedPrs': 'Accepted Pull Requests',
            'rejectedPrs': 'Rejected Pull Requests',
            'repositories': 'Repositories',
            'following': 'Users Following',
            'starred': 'Repos Starred',
            'forked': 'Repos Forked',
            'followers': 'Followers',
            'stars': 'Stars on Projects',
            'forks': 'Forks on Projects'
        })
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

    /**
     * Scan the data corresponding to a GitHub profile
     * @param {Token} token Token object to scan for.
     * @param {Function} cb Callback to accept the dictionary of statistic values found and/or an error.
     */
    static scan(token, cb) {
        // TODO
    }
}