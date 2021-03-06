import Strategy from 'passport-stack-exchange';
import { handleRemoteAuth } from './util';
import request from 'request';

const SE_BASEURL = 'https://api.stackexchange.com/2.2/';

/**
 * Provider for the Stack Exchange family of question and answer sites.
 */
export default class StackExchangeProvider {
    /**
     * Configure the provider.
     * @param {Passport} passport 
     * @param {Db} db 
     */
    static configure(passport, db) {
        db.Statistic.load({
            'questions': 'Questions Asked',
            'answers': 'Questions Answered',
            'reputation': 'Reputation'
        })
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
                        callbackURL: `${process.env.BASE_URL}/auth/${site.slug}/callback`,
                        passReqToCallback: true,
                        site: site.slug,
                        scope: 'no_expiry'
                    },
                    function(req, accessToken, refreshToken, profile, done) {
                        console.log(accessToken, refreshToken, profile);
                        const token = {
                            providerId: provider.providerId,
                            remoteUsername: profile['displayName'],
                            remoteId: profile['_json']['items'][0]['account_id'].toString(),
                            emailAddress: profile['_json']['email'],
                            accessToken
                        }
                        handleRemoteAuth(db, req, provider, token, (err, user, extra) => {
                            console.log(err, user, extra)
                            done(...arguments)
                        })
                    }
                ))
            )
        )
    }

    /**
     * Scan the data corresponding
     * @param {Token} token Token object to scan for.
     * @param {Function} cb Callback to accept the dictionary of statistic values found and/or an error.
     */
    static scan(token, cb) {
        
    }
}