import Semaphore from 'semaphore';

const MAX_WORKERS = 20; // size of per-instance semaphore for new scans

/**
 * `ScanQueue` manages the individual scan jobs to update statistics for the various tokens.
 */
export default class ScanQueue {
    constructor(db) {
        this.db = db;
        this.sem = Semaphore(MAX_WORKERS)
        this.enqueued = []
        this.providers = {}
        ScanQueue.instance = this
    }

    /**
     * Add a tokenId to the queue of tokens to be scanned.
     * @param {*} tokenId tokenId of token to be scanned.
     */
    enqueue(tokenId) {
        if (this.enqueued.includes(tokenId)) return; // TODO: worry about overqueuing
        this.enqueued.push(tokenId);
        this.sem.take(()=>{
            this.db.Token.findOne({
                where: { tokenId },
                include:  [{ model: this.db.Provider }]
            }).then(token => {
                console.log("queue run", token);
                this.runScan(token);
            })
            this.enqueued = this.enqueued.filter(x => x === tokenId);
            this.sem.leave();
        })
    }

    /**
     * Immediately begin executing the appropriate scan for this token
     * @param {Token} token Token object with Provider
     */
    runScan(token) {
        let {provider} = token;
        let {slug} = provider;
        if (!this.providers[slug]) this.providers[slug] = require(`./providers/${slug}-provider.js`).default
        this.providers[slug].scan(token, (statistics, err)=>{
            if (err) {
                token.broken = true;
            } else {
                token.lastUsedAt = Date.now()
            }
            token.save()
            if (statistics) this.captureStatistics(statistics, token)
        });
    }

    /**
     * Record statistics from a scan
     * @param {Object} statistics Dictionary of statisticSlug -> value pairs 
     * @param {Token} token Token object to record scan for
     */
    captureStatistics(statistics, token) {
        Object.keys(statistics).map(statisticSlug => {
            const value = statistics[statisticSlug]
            this.db.Scan.record(statisticSlug, value, token)
        })
    }

    /**
     * Queue a token ID to be scanned by the global ScanQueue instance.
     * @param {number} tokenId tokenId of the Token to scan.
     */
    static enqueue(tokenId) {
        ScanQueue.instance.enqueue(tokenId);
    }
}