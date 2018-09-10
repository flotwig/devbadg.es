import ScanQueue from '../scan-queue.js';

/**
 * Function to either log a user in or create an account or associate their account with a remote provider.
 * 
 * If a user is logged in but this remote ID is already associated with another account, error out.
 *  Otherwise, associate this remote user with their account.
 * If a user is not logged in and this remote ID is associated with an account, log them in to that.
 *  If it's not associated with an account, create one for them and log them in to that.
 * 
 * @param {Db} db `Db` class
 * @param {Express.Request} req HTTP request to callback
 * @param {*} provider a `Provider` object
 * @param {Token} token a partially filled out token object to find the user or create it with
 * @param {Function} done Callback: done(error, user, details)
 */
export function handleRemoteAuth(db, req, provider, userToken, done) {
    // does a profile already exist with this remote ID?
    db.Token.findOne({
        where: { remoteId: userToken.remoteId },
        include: [{
            model: db.Provider,
            where: { slug: provider.slug }
        }]
    }).then((token) => {
        if (token) {
            // found this github user already in our database
            if (req.user) {
                // logged in, reject this cuz it belongs to another account
                done(false, req.user, { 'message': `That ${provider.name} account is already associated with another account on devbadg.es.`})
                // TODO
            } else {
                // not logged in, log them in to this account
                token.getUser().then(user => {
                    done(false, user, { 'justLoggedIn': true })
                })
            }
        } else {
            // this is a token we haven't seen before
            if (!req.user) {
                // not logged in, create account
                db.findAvailableSlug(userToken.remoteUsername, (slug) => {
                    db.User.create({
                        slug, 
                        emailAddress: userToken.emailAddress
                    }).then((user) => {
                        // attach token
                        userToken.userId = user.userId
                        db.Token.create(userToken).then(token=>{
                            ScanQueue.enqueue(token.tokenId);
                            done(false, user, { 'justCreatedAccount': true })
                        });
                    })
                })
            } else {
                // attach token
                userToken.userId = req.user.userId
                db.Token.create(userToken).then(token => {
                    ScanQueue.enqueue(token.tokenId)
                    done(false, req.user, { token })
                })
            }
        }
    })
}