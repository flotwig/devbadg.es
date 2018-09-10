import Semaphore from 'semaphore';

const MAX_WORKERS = 20;

export default class ScanQueue {
    constructor(db) {
        this.db = db;
        this.sem = Semaphore(MAX_WORKERS)
        this.enqueued = []
        this.providers = {}
        ScanQueue.instance = this
    }

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

    runScan(token) {
        let {provider} = token;
        let {slug} = provider;
        if (!this.providers[slug]) this.providers[slug] = require(`./providers/${slug}-provider.js`).default
        this.providers[slug].scan(token);
    }

    static enqueue(tokenId) {
        ScanQueue.instance.enqueue(tokenId);
    }
}